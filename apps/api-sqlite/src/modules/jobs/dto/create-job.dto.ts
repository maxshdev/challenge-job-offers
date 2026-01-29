import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobType, JobLevel } from '../job.entity';

export class CreateJobDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    requirements?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    company: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ enum: JobType, default: JobType.FULL_TIME })
    @IsEnum(JobType)
    @IsOptional()
    job_type?: JobType;

    @ApiProperty({ enum: JobLevel, default: JobLevel.JUNIOR })
    @IsEnum(JobLevel)
    @IsOptional()
    level?: JobLevel;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    salary_min?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    salary_max?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    currency?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    benefits?: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    expiration_date?: Date;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    allow_public_apply?: boolean;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    posted_by_id?: string;
}
