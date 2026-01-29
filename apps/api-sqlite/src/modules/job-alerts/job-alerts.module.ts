import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobAlertsService } from './job-alerts.service';
import { JobAlertsController } from './job-alerts.controller';
import { JobAlert } from './job-alert.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobAlert]),
    ],
    controllers: [JobAlertsController],
    providers: [JobAlertsService],
    exports: [JobAlertsService],
})
export class JobAlertsModule { }
