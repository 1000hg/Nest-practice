import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
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

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_email_verified: boolean;
}
