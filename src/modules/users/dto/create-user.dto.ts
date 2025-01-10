import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({
    enum: ['user', 'admin'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['user', 'admin'])
  role?: 'user' | 'admin';

  @ApiProperty({
    enum: ['local', 'social'],
  })
  @IsOptional()
  @IsEnum(['local', 'social'])
  login_type?: 'local' | 'social';

  @ApiProperty({
    enum: ['local', 'google'],
  })
  @IsOptional()
  @IsEnum(['local', 'google'])
  provider?: 'local' | 'google';

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  is_email_verified: boolean;
}
