import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

import { JobApplication } from './job-application.entity';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { Job } from 'src/modules/jobs/job.entity';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class JobApplicationsService {
  private readonly logger = new Logger(JobApplicationsService.name);

  constructor(
    @InjectRepository(JobApplication)
    private readonly applicationsRepo: Repository<JobApplication>,
    @InjectRepository(Job)
    private readonly jobsRepo: Repository<Job>,
    private readonly mailerService: MailerService,
    private readonly jobsService: JobsService,
  ) { }

  /**
   * Get all job applications
   */
  async findAll(): Promise<JobApplication[]> {
    return this.applicationsRepo.find({
      relations: ['job', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Get all job applications for a user
   */
  async findByUserId(userId: string): Promise<JobApplication[]> {
    return this.applicationsRepo.find({
      where: { user_id: userId },
      relations: ['job', 'user'],
    });
  }

  /**
   * Get all job applications for a job
   */
  async findByJobId(jobId: string): Promise<JobApplication[]> {
    return this.applicationsRepo.find({
      where: { job_id: jobId },
      relations: ['user'],
    });
  }

  /**
   * Get a specific job application
   */
  async findOne(id: string): Promise<JobApplication> {
    const application = await this.applicationsRepo.findOne({
      where: { id },
      relations: ['job', 'user'],
    });

    if (!application)
      throw new NotFoundException(`Application with id ${id} not found`);

    return application;
  }

  /**
   * Create a job application and send email
   */
  async create(
    jobId: string,
    userId: string | null,
    dto: CreateJobApplicationDto,
  ): Promise<JobApplication> {
    // Verify that the job exists (fetching and persisting if it is external)
    const job = await this.jobsService.findAndPersist(jobId);
    // findAndPersist throws NotFoundException if not found, so we don't need manual check here
    // But we need to use the persisted job.id for the application
    const persistedJobId = job.id;

    // Verify that there is no duplicate application from the same user to the same job
    if (userId) {
      const existing = await this.applicationsRepo.findOne({
        where: { user_id: userId, job_id: jobId },
      });

      if (existing)
        throw new BadRequestException(
          'You have already applied to this job',
        );
    }

    // Create the job application
    const application = this.applicationsRepo.create({
      email: dto.email,
      phone: dto.phone,
      cover_letter: dto.cover_letter,
      resume_url: dto.resume_url,
      job_id: persistedJobId,
      user_id: userId || undefined,
    });

    const savedApplication = await this.applicationsRepo.save(application);

    // Send confirmation email asynchronously
    this.sendApplicationConfirmationEmail(savedApplication, job).catch(
      (error) => {
        this.logger.error(
          `Failed to send confirmation email: ${error.message}`,
        );
      },
    );

    return savedApplication;
  }

  /**
   * Update job application status
   */
  async updateStatus(
    id: string,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected',
  ): Promise<JobApplication> {
    const application = await this.findOne(id);
    application.status = status;
    return this.applicationsRepo.save(application);
  }

  /**
   * Delete a job application
   */
  async remove(id: string): Promise<void> {
    const application = await this.findOne(id);
    await this.applicationsRepo.remove(application);
  }

  /**
   * Resend job application notification
   */
  async resendNotification(id: string): Promise<JobApplication> {
    const application = await this.findOne(id);
    const job = await this.jobsRepo.findOne({ where: { id: application.job_id } });

    if (!job) throw new NotFoundException('Job not found');

    await this.sendApplicationConfirmationEmail(application, job);
    return application;
  }

  /**
   * Send email using Mailtrap API
   */
  private async sendWithMailtrap(to: string, subject: string, html: string, text: string) {
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
          name: 'Mailtrap Test'
        },
        to: [{ email: to }],
        subject: subject,
        text: text,
        html: html,
        category: 'Job Application'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mailtrap API error: ${error}`);
    }

    return response.json();
  }

  /**
   * Send job application confirmation email
   */
  private async sendApplicationConfirmationEmail(
    application: JobApplication,
    job: Job,
  ): Promise<void> {
    try {
      const subject = `¡Postulación recibida! - ${job.title}`;
      const text = `Gracias por tu postulación para ${job.title} en ${job.company}.`;
      const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Gracias por tu postulación!</h2>
            <p>Hemos recibido tu solicitud para el siguiente puesto:</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0;">${job.title}</h3>
              <p style="margin: 5px 0;"><strong>Empresa:</strong> ${job.company}</p>
              <p style="margin: 5px 0;"><strong>Ubicación:</strong> ${job.location}</p>
              <p style="margin: 5px 0;"><strong>Tipo:</strong> ${job.job_type}</p>
            </div>

            <p>Tu postulación ha sido registrada exitosamente. El equipo de recursos humanos revisará tu perfil y se comunicará contigo en los próximos días.</p>

            <p>Mientras tanto, puedes seguir explorando más ofertas de empleo en nuestra plataforma.</p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Este es un email automático, por favor no respondas a esta dirección.
            </p>
          </div>
      `;

      // Use Mailtrap API instead of MailerService
      await this.sendWithMailtrap(application.email, subject, html, text);

      this.logger.log(`Email sent to ${application.email} via Mailtrap API`);
    } catch (error) {
      this.logger.error(
        `Failed to send confirmation email to ${application.email}: ${error.message}`,
      );
      // Don't throw to avoid crashing the request, just log
    }
  }
}
