const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ============================================
// SEND VERIFICATION EMAIL
// ============================================
exports.sendVerificationEmail = async (userEmail, token) => {
  try {
    const verificationLink = `http://localhost:5173/verify-email/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🌿 Verify Your EcoSnap Account',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0a0a0a 0%, #0d1410 100%); color: #10b981; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🌿 EcoSnap</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Turn Trash into Global Intelligence</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px;">
              <h2 style="color: #0a0a0a; margin-top: 0;">Welcome to EcoSnap! 🎉</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thanks for joining our community of environmental warriors. To unlock all features and start making a difference, please verify your email address by clicking the button below.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${verificationLink}" 
                   style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                  ✅ Verify My Email
                </a>
              </div>

              <p style="color: #999; font-size: 13px; margin-bottom: 20px;">
                Or copy this link in your browser:<br/>
                <code style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; display: block; word-break: break-all;">
                  ${verificationLink}
                </code>
              </p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

              <p style="color: #999; font-size: 12px; margin: 0;">
                This link expires in 24 hours. If you didn't create this account, please ignore this email.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
              <p style="margin: 0;">© 2026 EcoSnap. All rights reserved.</p>
              <p style="margin: 10px 0 0 0;">Made with 💚 for the planet</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Email Send Error:', error.message);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

// ============================================
// SEND PASSWORD RESET EMAIL (Optional for future)
// ============================================
exports.sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🔐 EcoSnap Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <div style="background: linear-gradient(135deg, #0a0a0a 0%, #0d1410 100%); color: #10b981; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🌿 EcoSnap</h1>
            </div>

            <div style="padding: 40px;">
              <h2 style="color: #0a0a0a;">Password Reset Request</h2>
              <p style="color: #666; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password. This link expires in 1 hour.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>

              <p style="color: #999; font-size: 12px;">
                If you didn't request a password reset, ignore this email. Your password will remain unchanged.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Email Send Error:', error.message);
    throw new Error(`Failed to send reset email: ${error.message}`);
  }
};
