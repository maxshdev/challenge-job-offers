import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './job.entity';
import { JobApplicationsService } from 'src/modules/job-applications/job-applications.service';
import { JobApplication } from 'src/modules/job-applications/job-application.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { ExternalJobSourcesModule } from '../external-job-sources/external-job-sources.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobApplication]),
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
    forwardRef(() => ExternalJobSourcesModule),
  ],
  controllers: [JobsController],
  providers: [JobsService, JobApplicationsService],
  exports: [JobsService],
})
export class JobsModule { }
