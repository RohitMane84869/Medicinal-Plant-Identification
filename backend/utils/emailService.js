import nodemailer from 'nodemailer';

// Create transporter with Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'PlantMed AI',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🔐 Password Reset Code - PlantMed AI',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - PlantMed AI</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2d3748; background-color: #f7fafc; }
            .email-wrapper { background-color: #f7fafc; padding: 40px 20px; }
            .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { font-size: 28px; margin-bottom: 8px; font-weight: 700; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #2d3748; }
            .message { font-size: 16px; margin-bottom: 30px; color: #4a5568; }
            .otp-container { background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%); border: 2px solid #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
            .otp-label { font-size: 14px; color: #4a5568; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
            .otp-code { font-size: 36px; font-weight: 800; color: #10b981; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 10px 0; }
            .security-notice { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0; }
            .security-notice h3 { color: #92400e; font-size: 16px; margin-bottom: 12px; display: flex; align-items: center; }
            .security-notice ul { color: #78350f; font-size: 14px; }
            .security-notice li { margin-bottom: 8px; }
            .help-text { font-size: 14px; color: #718096; margin-top: 30px; }
            .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { color: #718096; font-size: 14px; margin-bottom: 5px; }
            .footer .company { font-weight: 600; color: #2d3748; }
            .footer .disclaimer { font-size: 12px; color: #a0aec0; margin-top: 15px; }
            @media (max-width: 600px) {
              .email-wrapper { padding: 20px 10px; }
              .content { padding: 30px 20px; }
              .otp-code { font-size: 28px; letter-spacing: 4px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="email-container">
              <div class="header">
                <h1>🌿 PlantMed AI</h1>
                <p>Secure Password Reset</p>
              </div>
              
              <div class="content">
                <div class="greeting">Hello ${userName || 'Valued User'},</div>
                
                <div class="message">
                  We received a request to reset your PlantMed AI account password. To proceed with the password reset, please use the verification code below:
                </div>
                
                <div class="otp-container">
                  <div class="otp-label">Verification Code</div>
                  <div class="otp-code">${otp}</div>
                </div>
                
                <div class="security-notice">
                  <h3>🛡️ Important Security Information</h3>
                  <ul>
                    <li><strong>Valid for 10 minutes only</strong> - This code will expire automatically</li>
                    <li><strong>Keep it confidential</strong> - Never share this code with anyone</li>
                    <li><strong>One-time use</strong> - Code becomes invalid after successful password reset</li>
                    <li><strong>Didn't request this?</strong> Please ignore this email and contact support if concerned</li>
                  </ul>
                </div>
                
                <div class="help-text">
                  If you're having trouble with the password reset process or didn't request this change, please contact our support team immediately at support@plantmed.ai
                </div>
              </div>
              
              <div class="footer">
                <p class="company">PlantMed AI Security Team</p>
                <p>Protecting your botanical discoveries</p>
                <p class="disclaimer">This is an automated security email. Please do not reply to this message.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'PlantMed AI',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🌿 Welcome to PlantMed AI - Your Journey Begins!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PlantMed AI</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2d3748; background-color: #f7fafc; }
            .email-wrapper { background-color: #f7fafc; padding: 40px 20px; }
            .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 50px 30px; text-align: center; }
            .header h1 { font-size: 32px; margin-bottom: 12px; font-weight: 700; }
            .header p { font-size: 18px; opacity: 0.95; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #2d3748; }
            .welcome-message { font-size: 16px; margin-bottom: 30px; color: #4a5568; }
            .features-grid { margin: 30px 0; }
            .feature-card { background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%); border-left: 4px solid #10b981; padding: 20px; margin: 15px 0; border-radius: 8px; transition: transform 0.2s; }
            .feature-card:hover { transform: translateY(-2px); }
            .feature-icon { font-size: 24px; margin-bottom: 8px; }
            .feature-title { font-size: 16px; font-weight: 600; color: #2d3748; margin-bottom: 8px; }
            .feature-desc { font-size: 14px; color: #4a5568; }
            .cta-section { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; }
            .cta-text { color: white; font-size: 18px; margin-bottom: 20px; }
            .cta-button { display: inline-block; background: white; color: #10b981; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: all 0.3s; }
            .cta-button:hover { background: #f7fafc; transform: translateY(-2px); }
            .stats { display: flex; justify-content: space-around; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px; }
            .stat { text-align: center; }
            .stat-number { font-size: 24px; font-weight: 700; color: #10b981; }
            .stat-label { font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 1px; }
            .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { color: #718096; font-size: 14px; margin-bottom: 5px; }
            .footer .company { font-weight: 600; color: #2d3748; }
            .social-links { margin-top: 20px; }
            .social-links a { color: #10b981; text-decoration: none; margin: 0 10px; }
            @media (max-width: 600px) {
              .email-wrapper { padding: 20px 10px; }
              .content { padding: 30px 20px; }
              .stats { flex-direction: column; gap: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="email-container">
              <div class="header">
                <h1>🌿 Welcome to PlantMed AI!</h1>
                <p>Your journey into nature's intelligence begins now</p>
              </div>
              
              <div class="content">
                <div class="greeting">Hello ${userName}! 👋</div>
                
                <div class="welcome-message">
                  Welcome to the future of botanical discovery! We're thrilled to have you join our community of researchers, students, and nature enthusiasts who are exploring the healing power of plants through artificial intelligence.
                </div>
                
                <div class="stats">
                  <div class="stat">
                    <div class="stat-number">2,500+</div>
                    <div class="stat-label">Plant Species</div>
                  </div>
                  <div class="stat">
                    <div class="stat-number">95%</div>
                    <div class="stat-label">Accuracy</div>
                  </div>
                  <div class="stat">
                    <div class="stat-number">50K+</div>
                    <div class="stat-label">Users</div>
                  </div>
                </div>
                
                <div class="features-grid">
                  <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <div class="feature-title">AI-Powered Plant Detection</div>
                    <div class="feature-desc">Upload photos to instantly identify medicinal plants with 95% accuracy using our advanced machine learning algorithms.</div>
                  </div>
                  
                  <div class="feature-card">
                    <div class="feature-icon">📚</div>
                    <div class="feature-title">Comprehensive Research Database</div>
                    <div class="feature-desc">Access detailed information about plant properties, traditional uses, and scientific research from our curated database.</div>
                  </div>
                  
                  <div class="feature-card">
                    <div class="feature-icon">🛡️</div>
                    <div class="feature-title">Safety & Usage Guidelines</div>
                    <div class="feature-desc">Get critical safety information, dosage recommendations, and contraindications for responsible plant use.</div>
                  </div>
                  
                  <div class="feature-card">
                    <div class="feature-icon">🌱</div>
                    <div class="feature-title">Personal Discovery Journal</div>
                    <div class="feature-desc">Track your botanical discoveries, save favorite plants, and build your personal medicinal plant knowledge base.</div>
                  </div>
                </div>
                
                <div class="cta-section">
                  <div class="cta-text">Ready to discover nature's pharmacy?</div>
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/detect" class="cta-button">Start Plant Detection →</a>
                </div>
              </div>
              
              <div class="footer">
                <p class="company">The PlantMed AI Team</p>
                <p>Bridging ancient wisdom with modern intelligence</p>
                <div class="social-links">
                  <a href="#">Blog</a> • <a href="#">Research</a> • <a href="#">Support</a>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Welcome email failed:', error);
    return { success: false, error: error.message };
  }
};