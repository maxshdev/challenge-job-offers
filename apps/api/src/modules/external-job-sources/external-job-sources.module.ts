import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalJobSourcesService } from './external-job-sources.service';
import { ExternalJobSourcesController } from './external-job-sources.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [HttpModule, forwardRef(() => JobsModule)],
  controllers: [ExternalJobSourcesController],
  providers: [ExternalJobSourcesService],
  exports: [ExternalJobSourcesService],
})
export class ExternalJobSourcesModule { }
