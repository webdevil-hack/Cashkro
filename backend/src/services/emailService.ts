import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  html?: string;
  text?: string;
  data?: any;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private loadTemplate(templateName: string, data: any = {}): string {
    try {
      const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
      let template = fs.readFileSync(templatePath, 'utf8');
      
      // Replace placeholders with data
      Object.keys(data).forEach(key => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(placeholder, data[key]);
      });
      
      return template;
    } catch (error) {
      console.error(`Failed to load email template: ${templateName}`, error);
      return this.getDefaultTemplate(data);
    }
  }

  private getDefaultTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CashKaro Clone</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #007bff; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>CashKaro Clone</h1>
              </div>
              <div class="content">
                  ${data.content || 'Thank you for using our service!'}
              </div>
              <div class="footer">
                  <p>&copy; 2024 CashKaro Clone. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      let html = options.html;
      
      if (options.template) {
        html = this.loadTemplate(options.template, options.data);
      }

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@cashkaro-clone.com',
        to: options.to,
        subject: options.subject,
        html: html || options.text,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Welcome to CashKaro Clone!',
      template: 'welcome',
      data: { firstName }
    });
  }

  async sendCashbackConfirmation(to: string, data: any): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Cashback Confirmed!',
      template: 'cashback-confirmation',
      data
    });
  }

  async sendWithdrawalConfirmation(to: string, data: any): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Withdrawal Processed',
      template: 'withdrawal-confirmation',
      data
    });
  }

  async sendReferralBonus(to: string, data: any): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Referral Bonus Earned!',
      template: 'referral-bonus',
      data
    });
  }
}

export const emailService = new EmailService();
export const sendEmail = (options: EmailOptions) => emailService.sendEmail(options);