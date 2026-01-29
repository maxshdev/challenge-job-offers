import { PartialType } from '@nestjs/mapped-types';
import { CreateJobAlertDto } from './create-job-alert.dto';

export class UpdateJobAlertDto extends PartialType(CreateJobAlertDto) {}
