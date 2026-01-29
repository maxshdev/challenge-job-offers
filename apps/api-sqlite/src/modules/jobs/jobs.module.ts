import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './job.entity';
import { ExternalJobSourcesModule } from '../external-job-sources/external-job-sources.module';
import { JobApplicationsModule } from '../job-applications/job-applications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Job]),
        forwardRef(() => ExternalJobSourcesModule),
        forwardRef(() => JobApplicationsModule),
    ],
    controllers: [JobsController],
    providers: [JobsService],
    exports: [JobsService],
})
export class JobsModule { }
