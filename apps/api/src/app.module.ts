import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// === Domain Modules ===
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { UserProfilesModule } from './modules/user-profiles/user-profiles.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { JobAlertsModule } from './modules/job-alerts/job-alerts.module';
import { JobApplicationsModule } from './modules/job-applications/job-applications.module';
import { ExternalJobSourcesModule } from './modules/external-job-sources/external-job-sources.module';
import { TradeOrdersModule } from './modules/trade-orders/trade-orders.module';

// === Authentication Strategies ===
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { JobsService } from './modules/jobs/jobs.service';
import { JobAlertsService } from './modules/job-alerts/job-alerts.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true, // only in development
      logging: true,
    }),
    AuthModule,
    RolesModule,
    UsersModule,
    InvoicesModule,
    UserProfilesModule,
    JobsModule,
    JobAlertsModule,
    JobApplicationsModule,
    ExternalJobSourcesModule,
    TradeOrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule implements OnModuleInit {
  constructor(
    private jobsService: JobsService,
    private jobAlertsService: JobAlertsService,
  ) { }

  /**
   * Inject JobAlertsService into JobsService to avoid circular dependency
   */
  onModuleInit() {
    this.jobsService.setJobAlertsService(this.jobAlertsService);
  }
}
