import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: `"Youth Development Program" <${process.env.EMAIL_FROM || 'infoyda2024@gmail.com'}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

const baseTemplate = (content: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <div style="background-color: #1B2A6B; padding: 20px; text-align: center;">
      <h1 style="color: #00BCD4; margin: 0;">Youth Development Program</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
      ${content}
    </div>
    <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
      &copy; ${new Date().getFullYear()} Youth Development Program. All rights reserved.
    </div>
  </div>
`;

export const welcomeEmail = (name: string) => baseTemplate(`
  <h2>Hello ${name},</h2>
  <p>Thank you for applying to join the Youth Development Program. Your application has been received and is currently under review.</p>
  <p>We will notify you once your application status changes.</p>
`);

export const memberApprovalEmail = (name: string, memberId: string) => baseTemplate(`
  <h2>Congratulations ${name}!</h2>
  <p>Your membership application has been approved.</p>
  <p>Your Official Member ID is: <strong>${memberId}</strong></p>
  <p>Welcome to the YDP family!</p>
`);

export const memberRejectionEmail = (name: string) => baseTemplate(`
  <h2>Dear ${name},</h2>
  <p>Thank you for your interest in joining the Youth Development Program.</p>
  <p>After careful consideration, we regret to inform you that we cannot approve your application at this time.</p>
`);

export const passwordResetEmail = (name: string, resetUrl: string) => baseTemplate(`
  <h2>Hello ${name},</h2>
  <p>You have requested to reset your password. Please click the link below to set a new password:</p>
  <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #00BCD4; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
  <p>If you did not request this, please ignore this email.</p>
`);

export const contactConfirmationEmail = (name: string) => baseTemplate(`
  <h2>Hi ${name},</h2>
  <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>
`);

export const contactNotificationEmail = (contact: {name: string, email: string, subject: string, message: string}) => baseTemplate(`
  <h2>New Contact Message</h2>
  <p><strong>Name:</strong> ${contact.name}</p>
  <p><strong>Email:</strong> ${contact.email}</p>
  <p><strong>Subject:</strong> ${contact.subject}</p>
  <p><strong>Message:</strong><br/>${contact.message.replace(/\n/g, '<br/>')}</p>
`);

export const eventRegistrationEmail = (name: string, event: {title: string, date: string, venue: string}) => baseTemplate(`
  <h2>Hi ${name},</h2>
  <p>You have successfully registered for the event: <strong>${event.title}</strong></p>
  <p><strong>Date:</strong> ${event.date}</p>
  <p><strong>Venue:</strong> ${event.venue}</p>
  <p>We look forward to seeing you there!</p>
`);

export const certificateEmail = (name: string, certId: string, verifyUrl: string) => baseTemplate(`
  <h2>Congratulations ${name},</h2>
  <p>Your certificate is ready.</p>
  <p>Certificate ID: <strong>${certId}</strong></p>
  <p>You can verify your certificate here: <a href="${verifyUrl}">Verify</a></p>
  <p>Your certificate PDF is attached or accessible via the dashboard.</p>
`);

export const volunteerApplicationEmail = (name: string) => baseTemplate(`
  <h2>Hi ${name},</h2>
  <p>Thank you for offering to volunteer with YDP. We have received your application and will contact you soon regarding available opportunities.</p>
`);
