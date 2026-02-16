import nodemailer from 'nodemailer';

// Configure email service (using Gmail, SendGrid, or your email provider)
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    };

    await emailTransporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err.message };
  }
};

export const sendReadinessScoreEmail = async (userEmail, userName, score, status) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007bff;">Your Readiness Score Updated! 📊</h2>
      <p>Hi ${userName},</p>
      <p>Your placement readiness score has been updated:</p>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin: 0;">Score: ${score}%</h3>
        <p style="color: #666; margin: 10px 0 0 0;">Status: <strong>${status}</strong></p>
      </div>
      
      <p>Keep practicing and improving! Visit your dashboard to see detailed breakdowns.</p>
      
      <p style="color: #666; margin-top: 30px; font-size: 12px;">
        Best regards,<br>
        Aptitude Tracker Team
      </p>
    </div>
  `;
  
  return sendEmail(to, '📊 Your Readiness Score Update', htmlContent);
};

export const sendAnnouncementEmail = async (userEmail, userName, title, description) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007bff;">📢 New Announcement</h2>
      <p>Hi ${userName},</p>
      
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #333; margin: 0;">${title}</h3>
        <p style="color: #666; margin: 10px 0 0 0;">${description}</p>
      </div>
      
      <p style="color: #666; margin-top: 30px; font-size: 12px;">
        Best regards,<br>
        Aptitude Tracker Team
      </p>
    </div>
  `;
  
  return sendEmail(userEmail, `📢 ${title}`, htmlContent);
};

export const sendMilestoneEmail = async (userEmail, userName, milestone) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">🎉 Congratulations!</h2>
      <p>Hi ${userName},</p>
      
      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #155724; margin: 0;">You've Achieved: ${milestone}</h3>
        <p style="color: #155724; margin: 10px 0 0 0;">Great work! Keep up the momentum! 🚀</p>
      </div>
      
      <p style="color: #666; margin-top: 30px; font-size: 12px;">
        Best regards,<br>
        Aptitude Tracker Team
      </p>
    </div>
  `;
  
  return sendEmail(userEmail, `🎉 ${milestone}`, htmlContent);
};
