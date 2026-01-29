import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobAlertDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search_pattern?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    job_type?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    level?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    location?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    salary_min?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    salary_max?: number;
}
