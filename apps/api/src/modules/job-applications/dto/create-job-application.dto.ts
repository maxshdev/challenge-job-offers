import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateJobApplicationDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  cover_letter?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  resume_url?: string;
}
