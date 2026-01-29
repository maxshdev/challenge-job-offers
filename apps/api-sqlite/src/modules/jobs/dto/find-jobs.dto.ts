import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobType, JobLevel } from '../job.entity';

export class FindJobsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 12;

    @ApiPropertyOptional({ description: 'Sort by field:direction (e.g. created_at:DESC)' })
    @IsOptional()
    @IsString()
    sort?: string;

    @ApiPropertyOptional({ enum: JobType })
    @IsOptional()
    @IsEnum(JobType)
    type?: JobType;

    @ApiPropertyOptional({ enum: JobLevel })
    @IsOptional()
    @IsEnum(JobLevel)
    level?: JobLevel;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsString()
    includeExternal?: string;
}
