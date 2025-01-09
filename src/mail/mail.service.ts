import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    });
  }

  /** 이메일 인증 메일 발송 */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl =
      this.configService.get('SERVER_URL') +
      `/auth/verify-email?email=${email}&token=${token}`;
    const mailOptions = {
      from: this.configService.get('MAIL_USER'),
      to: email,
      subject: '이메일 인증 요청',
      html: `
          <h1>이메일 인증</h1>
          <p>다음 링크를 클릭하여 이메일을 인증해주세요:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
        `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
