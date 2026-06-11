import nodemailer from 'nodemailer';

export const sendMail = async ({ to, subject, html, text }) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const hasCredentials = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD;

  if (!hasCredentials) {
    console.warn('⚠️ [SMTP CONFIG] Gmail credentials (GMAIL_USER / GMAIL_APP_PASSWORD) are not configured.');
    
    if (isDev) {
      console.log('\n================================================================');
      console.log('💌 [DEVELOPMENT EMAIL FALLBACK] (Not sent to recipient)');
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('----------------------------------------------------------------');
      console.log(`Text:\n${text}`);
      console.log('================================================================\n');
      
      return { messageId: 'mock-dev-message-id', mock: true };
    } else {
      throw new Error('Email service error: Missing SMTP credentials.');
    }
  }

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
    
    if (isDev) {
      console.log('\n================================================================');
      console.log('💌 [DEVELOPMENT EMAIL FALLBACK] (Send failed, logged below)');
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('----------------------------------------------------------------');
      console.log(`Text:\n${text}`);
      console.log('================================================================\n');
      
      return { messageId: 'mock-dev-message-id-after-failure', mock: true };
    }

    throw new Error(`Email service error: ${error.message}`);
  }
};

