import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    private async findAlertsForJob(job: Job): Promise<JobAlert[]> {
        const query = this.jobAlertsRepo.createQueryBuilder('alert');
        query.where('alert.is_active = :is_active', { is_active: true });

        if (job.title || job.description || job.company) {
            query.andWhere(
                `(
                  alert.search_pattern IS NULL OR 
                  alert.search_pattern = '' OR
                  :title LIKE '%' || alert.search_pattern || '%' OR
                  :description LIKE '%' || alert.search_pattern || '%' OR
                  :company LIKE '%' || alert.search_pattern || '%'
                )`,
                {
                    title: job.title || '',
                    description: job.description || '',
                    company: job.company || ''
                }
            );
        }

        if (job.location) {
            query.andWhere(
                `(alert.location IS NULL OR job.location LIKE :location)`,
                { location: `%${job.location}%` }
            );
        }

        if (job.job_type) {
            query.andWhere(
                `(alert.job_type IS NULL OR alert.job_type = :job_type)`,
                { job_type: job.job_type },
            );
        }

        if (job.level) {
            query.andWhere(
                `(alert.level IS NULL OR alert.level = :level)`,
                { level: job.level },
            );
        }

        return query.getMany();
    }

    private async sendJobNotification(alert: JobAlert, job: Job): Promise<void> {
        const subject = `Nueva oferta: ${job.title} en ${job.company}`;
        const text = `Se ha publicado una nueva oferta que coincide con tu alerta: ${job.title}.`;
        const html = `<h2>¡Nuevo empleo para ti!</h2><p>${job.title} en ${job.company}</p>`;

        try {
            const token = process.env.MAILTRAP_TOKEN;
            if (!token) {
                this.logger.warn('MAILTRAP_TOKEN not found, skipping email');
                return;
            }

            await fetch('https://sandbox.api.mailtrap.io/api/send/208034', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: { email: 'alerts@jobsapi.local', name: 'Jobs Alerts' },
                    to: [{ email: alert.email }],
                    subject,
                    text,
                    html,
                })
            });

            this.logger.log(`Email notification sent to ${alert.email} for job ${job.id}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${alert.email}: ${error.message}`);
            throw error;
        }
    }
}
