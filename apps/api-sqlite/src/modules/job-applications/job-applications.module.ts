import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsModule } from '../jobs/jobs.module';

import { JobApplicationsService } from './job-applications.service';
import { JobApplicationsController } from './job-applications.controller';
import { JobApplication } from './job-application.entity';
import { Job } from 'src/modules/jobs/job.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobApplication, Job]),
        forwardRef(() => JobsModule),
    ],
    controllers: [JobApplicationsController],
    providers: [JobApplicationsService],
    exports: [JobApplicationsService],
})
export class JobApplicationsModule { }
