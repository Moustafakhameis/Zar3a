import nodemailer from 'nodemailer';
import axios from 'axios';

const logFallback = ({ to, subject, text }) => {
  console.log('\n================================================================');
  console.log('💌 [DEVELOPMENT EMAIL FALLBACK] (Not sent to recipient)');
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('----------------------------------------------------------------');
  console.log(`Text:\n${text}`);
  console.log('================================================================\n');
};

export const sendMail = async ({ to, subject, html, text }) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const brevoApiKey = process.env.BREVO_API_KEY;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const senderEmail = process.env.SENDER_EMAIL || 'mjkk605@gmail.com';
  const senderName = process.env.SENDER_NAME || 'Zar3a Team';

  // 1. Try Brevo HTTP API if API key is present
  if (brevoApiKey) {
    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text || html.replace(/<[^>]*>/g, ''),
        },
        {
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('📧 Email sent successfully via Brevo API:', response.data.messageId || 'Success');
      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      console.error('❌ Failed to send email via Brevo API:', errMsg);
      
      // If Brevo fails and we don't have Gmail, try to log and return mock in dev
      if (!gmailUser || !gmailPass) {
        if (isDev) {
          logFallback({ to, subject, text });
          return { messageId: 'mock-dev-id-brevo-fail', mock: true };
        }
        throw new Error(`Email service error (Brevo): ${errMsg}`);
      }
    }
  }

  // 2. Try Gmail SMTP if credentials are present
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const mailOptions = {
        from: `"${senderName}" <${gmailUser}>`,
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
        logFallback({ to, subject, text });
        return { messageId: 'mock-dev-id-gmail-fail', mock: true };
      }

      throw new Error(`Email service error (Gmail): ${error.message}`);
    }
  }

  // 3. Fallback for Dev Mode when no credentials/services are configured
  if (isDev) {
    console.warn('⚠️ [SMTP CONFIG] No email service credentials succeeded or are configured.');
    logFallback({ to, subject, text });
    return { messageId: 'mock-dev-id-no-credentials', mock: true };
  } else {
    throw new Error('Email service error: No configured email transport succeeded.');
  }
};


