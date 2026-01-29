import { PartialType } from '@nestjs/swagger';
import { CreateJobAlertDto } from './create-job-alert.dto';

export class UpdateJobAlertDto extends PartialType(CreateJobAlertDto) { }
