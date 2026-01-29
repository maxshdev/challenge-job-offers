import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'superadmin@example.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'superadmin123', required: true })
  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;
}
