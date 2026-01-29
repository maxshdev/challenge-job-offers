import { IsString, IsOptional, IsEnum, IsNumber, IsDate } from 'class-validator';
import { JobType, JobLevel } from '../job.entity';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsString()
  company: string;

  @IsString()
  location: string;

  @IsEnum(JobType)
  @IsOptional()
  job_type?: JobType;

  @IsEnum(JobLevel)
  @IsOptional()
  level?: JobLevel;

  @IsNumber()
  @IsOptional()
  salary_min?: number;

  @IsNumber()
  @IsOptional()
  salary_max?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  benefits?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiration_date?: Date;
}
