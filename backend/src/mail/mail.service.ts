import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailerService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not defined');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
      throw new Error('SENDGRID_FROM_EMAIL is not defined');
    }

    const verificationUrl = `${process.env.FRONT_URL}/verify-email?token=${token}`;

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Verify Your Email',
      html: `<p>Please click the following link to verify your email:</p>
             <p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendResetPasswordEmail(
    email: string,
    resetToken: string | Uint8Array<ArrayBufferLike>,
  ) {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!fromEmail) {
      throw new Error('SENDGRID_FROM_EMAIL is not defined');
    }

    const tokenString =
      resetToken instanceof Uint8Array
        ? Buffer.from(resetToken).toString('base64')
        : resetToken;

    const resetUrl = `${process.env.FRONT_URL}/reset-password?token=${tokenString}`;

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Reset Your Password',
      html: `<p>Please click the following link to reset your password:</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Reset password email sent successfully');
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new Error('Failed to send reset password email');
    }
  }
}
