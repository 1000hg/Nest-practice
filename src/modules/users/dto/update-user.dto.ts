import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({
    enum: ['user', 'admin'],
    required: false,
  })
  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: 'user' | 'admin';

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
