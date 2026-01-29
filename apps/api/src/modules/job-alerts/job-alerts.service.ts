import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

import { JobAlert } from './job-alert.entity';
import { Job } from '../jobs/job.entity';
import { CreateJobAlertDto } from './dto/create-job-alert.dto';
import { UpdateJobAlertDto } from './dto/update-job-alert.dto';

@Injectable()
export class JobAlertsService {
  private readonly logger = new Logger(JobAlertsService.name);

  constructor(
    @InjectRepository(JobAlert)
    private readonly jobAlertsRepo: Repository<JobAlert>,
    private readonly mailerService: MailerService,
  ) { }

  async findAll(): Promise<JobAlert[]> {
    return this.jobAlertsRepo.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<JobAlert> {
    const alert = await this.jobAlertsRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!alert) throw new NotFoundException(`Job alert with id ${id} not found`);

    return alert;
  }

  async create(dto: CreateJobAlertDto): Promise<JobAlert> {
    const alert = this.jobAlertsRepo.create(dto);
    return this.jobAlertsRepo.save(alert);
  }

  async update(id: string, dto: UpdateJobAlertDto): Promise<JobAlert> {
    const alert = await this.findOne(id);

    Object.assign(alert, dto);
    return this.jobAlertsRepo.save(alert);
  }

  async remove(id: string): Promise<void> {
    const alert = await this.findOne(id);
    await this.jobAlertsRepo.remove(alert);
  }

  /**
   * Searches for active alerts that match the new job criteria
   * and sends email notifications to subscribers
   */
  async notifyOnNewJob(job: Job): Promise<{ notified: number; failed: number }> {
    let notified = 0;
    let failed = 0;

    try {
      const matchingAlerts = await this.findAlertsForJob(job);

      for (const alert of matchingAlerts) {
        try {
          await this.sendJobNotification(alert, job);
          notified++;
        } catch (error) {
          this.logger.error(
            `Failed to send notification for alert ${alert.id}: ${error.message}`,
          );
          failed++;
        }
      }

      this.logger.log(
        `Notified ${notified} subscribers about new job ${job.id}, ${failed} failed`,
      );
      return { notified, failed };
    } catch (error) {
      this.logger.error(`Failed to notify on new job: ${error.message}`);
      return { notified, failed };
    }
  }

  /**
   * Finds active alerts that match job criteria
   */
  private async findAlertsForJob(job: Job): Promise<JobAlert[]> {
    this.logger.debug(`Finding alerts for job: ${JSON.stringify({
      title: job.title,
      company: job.company,
      location: job.location,
      job_type: job.job_type,
      level: job.level,
      salary_min: job.salary_min,
      salary_max: job.salary_max
    })}`);

    // DEBUG: Log all active alerts to see what we are missing
    const allActiveAlerts = await this.jobAlertsRepo.find({ where: { is_active: true } });
    this.logger.debug(`Active alerts in DB: ${JSON.stringify(allActiveAlerts)}`);

    // Fetch ALL active alerts
    const activeAlerts = await this.jobAlertsRepo.find({
      where: { is_active: true }
    });

    this.logger.debug(`Found ${activeAlerts.length} active alerts to check against job`);

    // Filter in memory
    const matchingAlerts = activeAlerts.filter(alert => this.isMatch(alert, job));

    this.logger.debug(`Found ${matchingAlerts.length} matching alerts after filtering`);
    return matchingAlerts;
  }

  /**
   * Checks if an alert matches a job based on user preferences.
   * Logic:
   * 1. Keywords (search_pattern) are PRIMARY. If they match, we notify (ignoring other strict filters).
   * 2. If no keywords are set, we rely on the other filters (Location, Type, Level, Salary).
   */
  private isMatch(alert: JobAlert, job: Job): boolean {
    const jobText = `${job.title} ${job.description} ${job.company}`.toLowerCase();

    // 1. Keyword Matching (Prioritized)
    if (alert.search_pattern) {
      // Split pattern into tokens (handling spaces and commas)
      const tokens = alert.search_pattern.toLowerCase().split(/[\s,]+/).filter(t => t.length > 0);

      // Check if ALL tokens are present in the job text
      const allTokensMatch = tokens.every(token => jobText.includes(token));

      // If keywords match, we consider it a match regardless of other filters (as requested)
      if (allTokensMatch) {
        return true;
      }

      // If keywords exist but don't match, it's a hard fail
      return false;
    }

    // 2. Fallback: No keywords set, use strict filters
    // Location
    if (alert.location) {
      const alertLoc = alert.location.toLowerCase();
      const jobLoc = job.location.toLowerCase();
      if (!jobLoc.includes(alertLoc)) return false;
    }

    // Job Type
    if (alert.job_type) {
      if (alert.job_type.toLowerCase() !== job.job_type.toLowerCase()) return false;
    }

    // Level
    if (alert.level) {
      if (alert.level.toLowerCase() !== job.level.toLowerCase()) return false;
    }

    // Salary (If alert has both defined, job must fall within or overlap? 
    // Usually job seeker wants strict range, but here we assume if data is missing e.g. job has no salary, we might match?
    // Let's keep it simple: if alert has requirements, job must meet them provided job has data.
    if (alert.salary_min != null && job.salary_max != null) {
      if (job.salary_max < alert.salary_min) return false;
    }
    if (alert.salary_max != null && job.salary_min != null) {
      if (job.salary_min > alert.salary_max) return false;
    }

    return true;
  }

  /**
   * Send email using Mailtrap API
   */
  private async sendWithMailtrap(to: string, subject: string, html: string) {
    const token = process.env.MAILTRAP_TOKEN;
    if (!token) {
      this.logger.warn('MAILTRAP_TOKEN not found, skipping email sending');
      return;
    }

    const response = await fetch('https://sandbox.api.mailtrap.io/api/send/208034', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: {
          email: 'hello@example.com',
          name: 'Job Alerts'
        },
        to: [{ email: to }],
        subject: subject,
        html: html,
        category: 'Job Alert'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mailtrap API error: ${error}`);
    }

    return response.json();
  }

  /**
   * Sends email notification about a new job matching the alert
   */
  private async sendJobNotification(alert: JobAlert, job: Job): Promise<void> {
    const htmlContent = `
      <h2>¡Nuevo empleo que coincide con tu alerta!</h2>
      <p>Hola,</p>
      <p>Se ha publicado una nueva oportunidad de empleo que coincide con tus criterios de búsqueda:</p>
      
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>${job.title}</h3>
        <p><strong>Empresa:</strong> ${job.company}</p>
        <p><strong>Ubicación:</strong> ${job.location}</p>
        <p><strong>Tipo:</strong> ${job.job_type}</p>
        <p><strong>Nivel:</strong> ${job.level}</p>
        ${job.salary_min && job.salary_max
        ? `<p><strong>Salario:</strong> ${job.currency || 'USD'} ${job.salary_min} - ${job.salary_max}</p>`
        : ''
      }
        <p><strong>Descripción:</strong></p>
        <p>${job.description.substring(0, 500)}...</p>
        ${job.requirements
        ? `<p><strong>Requisitos:</strong></p><p>${job.requirements.substring(0, 300)}...</p>`
        : ''
      }
      </div>
      
      <p style="margin-top: 20px;">
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/jobs/${job.id}" 
           style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Ver oferta completa
        </a>
      </p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #666;">
        Recibiste este email porque te suscribiste a alertas de empleo en nuestra plataforma.
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/alerts/${alert.id}/unsubscribe" 
           style="color: #007bff; text-decoration: none;">Desuscribirse</a>
      </p>
    `;

    try {
      // Use Mailtrap API directly
      await this.sendWithMailtrap(alert.email, `Nueva oferta: ${job.title} en ${job.company}`, htmlContent);
      this.logger.log(`Email notification sent to ${alert.email} for job ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${alert.email}: ${error.message}`);
      throw error;
    }
  }
}
