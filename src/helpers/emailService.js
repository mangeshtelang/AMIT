const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE) === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
    });
  } else {
    transporter = {
      async sendMail(payload) {
        return { messageId: `mock-${Date.now()}`, preview: payload };
      }
    };
  }

  return transporter;
}

exports.sendOverdueReminder = async ({ to, studentName, bookTitle, dueDate, fineAmount }) => {
  const mailer = getTransporter();
  const from = process.env.EMAIL_FROM || 'library@example.com';
  return mailer.sendMail({
    from,
    to,
    subject: `Library Reminder: ${bookTitle} is overdue`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
        <h2>Library Overdue Reminder</h2>
        <p>Dear ${studentName},</p>
        <p>This is a reminder that the book <strong>${bookTitle}</strong> was due on <strong>${new Date(dueDate).toLocaleDateString()}</strong>.</p>
        <p>Current estimated fine: <strong>${fineAmount}</strong></p>
        <p>Please return the book or contact the library desk.</p>
        <p>Regards,<br/>Library Team</p>
      </div>
    `
  });
};
