import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { JobsModule } from '../jobs/jobs.module';

import { JobApplicationsService } from './job-applications.service';
import { JobApplicationsController } from './job-applications.controller';
import { JobApplication } from './job-application.entity';
import { Job } from 'src/modules/jobs/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, Job]),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'localhost',
        port: parseInt(process.env.MAIL_PORT || '1025'),
        secure: process.env.MAIL_SECURE === 'true',
        auth: process.env.MAIL_USER
          ? {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          }
          : undefined,
      },
      defaults: {
        from: process.env.MAIL_FROM || 'noreply@jobsapi.local',
      },
    }),
    JobsModule,
  ],
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService],
  exports: [JobApplicationsService],
})
export class JobApplicationsModule { }
