import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import config from 'src/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class MailService {
  private transporter;
  private oAuthClient: OAuth2Client;
  private accessToken;
  constructor() {
    this.oAuthClient = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
    );
    this.oAuthClient.setCredentials({ refresh_token: config.refreshToken });
    this.accessToken = this.oAuthClient.getAccessToken();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        accessToken: this.accessToken,
        refreshToken: config.refreshToken,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
      },
    });
  }

  async sendVerificationEmail(email: string, verificationLink: string) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Click the following link to verify your email: ${verificationLink}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
