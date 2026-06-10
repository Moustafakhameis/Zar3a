import nodemailer from 'nodemailer';

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Zar3a Team" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully via Gmail:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email via Gmail:', error.message);
    
    // Fallback: log email content for development
    console.log('💌 Email fallback (not sent):');
    console.log({ to, subject, html, text });

    throw new Error(`Email service error: ${error.message}`);
  }
};
