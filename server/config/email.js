import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email, resetUrl) => {
  await transporter.sendMail({
    from: `"ShopApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password — ShopApp',
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
        
        <!-- Header -->
        <div style="background: #ef4444; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
            🛍️ ShopApp
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 12px;">
            Reset Your Password
          </h2>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            We received a request to reset your password. Click the button below to create a new password. This link expires in <strong>15 minutes</strong>.
          </p>

          <!-- Button -->
          <a href="${resetUrl}"
            style="display: inline-block; background: #ef4444; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Reset Password
          </a>

          <!-- Warning -->
          <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0; line-height: 1.6;">
            If you didn't request this, you can safely ignore this email. Your password will not be changed.
          </p>

          <!-- Link fallback -->
          <p style="color: #9ca3af; font-size: 11px; margin: 12px 0 0; word-break: break-all;">
            Or paste this link: ${resetUrl}
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0; text-align: center;">
            © 2024 ShopApp · This is an automated email, please do not reply
          </p>
        </div>
      </div>
      ` 
  });
};

export default transporter;