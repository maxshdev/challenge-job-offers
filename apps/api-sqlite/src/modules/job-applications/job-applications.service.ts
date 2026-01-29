import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
        private readonly jobsService: JobsService,
    ) { }

    async findAll(): Promise<JobApplication[]> {
        return this.applicationsRepo.find({
            relations: ['job', 'user'],
            order: { created_at: 'DESC' },
        });
    }

    async findByUserId(userId: string): Promise<JobApplication[]> {
        return this.applicationsRepo.find({
            where: { user_id: userId },
            relations: ['job', 'user'],
        });
    }

    async findByJobId(jobId: string): Promise<JobApplication[]> {
        return this.applicationsRepo.find({
            where: { job_id: jobId },
            relations: ['user'],
        });
    }

    async findOne(id: string): Promise<JobApplication> {
        const application = await this.applicationsRepo.findOne({
            where: { id },
            relations: ['job', 'user'],
        });

        if (!application)
            throw new NotFoundException(`Application with id ${id} not found`);

        return application;
    }

    async create(
        jobId: string,
        userId: string | null,
        dto: CreateJobApplicationDto,
    ): Promise<JobApplication> {
        const job = await this.jobsService.findAndPersist(jobId);
        const persistedJobId = job.id;

        if (userId) {
            const existing = await this.applicationsRepo.findOne({
                where: { user_id: userId, job_id: jobId },
            });

            if (existing)
                throw new BadRequestException(
                    'You have already applied to this job',
                );
        }

        const application = this.applicationsRepo.create({
            email: dto.email,
            phone: dto.phone,
            cover_letter: dto.cover_letter,
            resume_url: dto.resume_url,
            job_id: persistedJobId,
            user_id: userId || undefined,
        });

        const savedApplication = await this.applicationsRepo.save(application);

        this.sendApplicationConfirmationEmail(savedApplication, job).catch(
            (error) => {
                this.logger.error(
                    `Failed to send confirmation email: ${error.message}`,
                );
            },
        );

        return savedApplication;
    }

    async updateStatus(
        id: string,
        status: string,
    ): Promise<JobApplication> {
        const application = await this.findOne(id);
        application.status = status;
        return this.applicationsRepo.save(application);
    }

    async remove(id: string): Promise<void> {
        const application = await this.findOne(id);
        await this.applicationsRepo.remove(application);
    }

    async resendNotification(id: string): Promise<JobApplication> {
        const application = await this.findOne(id);
        const job = await this.jobsRepo.findOne({ where: { id: application.job_id } });

        if (!job) throw new NotFoundException('Job not found');

        await this.sendApplicationConfirmationEmail(application, job);
        return application;
    }

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
            await this.sendWithMailtrap(application.email, subject, html, text);
            this.logger.log(`Email sent to ${application.email} via Mailtrap API`);
        } catch (error) {
            this.logger.error(
                `Failed to send confirmation email to ${application.email}: ${error.message}`,
            );
        }
    }
}
