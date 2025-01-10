import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailStrategy } from './strategies/mail.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_MAIL_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_MAIL_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  providers: [MailService, MailStrategy],
  exports: [MailService],
})
export class MailModule {}
