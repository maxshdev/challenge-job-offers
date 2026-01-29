import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// === Domain Modules ===
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { JobAlertsModule } from './modules/job-alerts/job-alerts.module';
import { JobApplicationsModule } from './modules/job-applications/job-applications.module';
import { ExternalJobSourcesModule } from './modules/external-job-sources/external-job-sources.module';

import { JobsService } from './modules/jobs/jobs.service';
import { JobAlertsService } from './modules/job-alerts/job-alerts.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite',
            entities: [__dirname + '/**/*.entity.{ts,js}'],
            synchronize: true, // only in development
            logging: true,
        }),
        UsersModule,
        JobsModule,
        JobAlertsModule,
        JobApplicationsModule,
        ExternalJobSourcesModule,
    ],
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
