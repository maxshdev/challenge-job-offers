import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

import { JobAlertsService } from './job-alerts.service';
import { JobAlertsController } from './job-alerts.controller';
import { JobAlert } from './job-alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobAlert]),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '2525'),
        secure: process.env.MAIL_SECURE === 'true',
        auth: process.env.MAIL_USER
          ? {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          }
          : undefined,
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
    }),
  ],
  controllers: [JobAlertsController],
  providers: [JobAlertsService],
  exports: [JobAlertsService],
})
export class JobAlertsModule { }
