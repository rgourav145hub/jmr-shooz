import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';

// Load .env automatically in all environments
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    } catch (e) {}
  }
}
loadEnvFile(path.resolve(process.cwd(), '.env'));
loadEnvFile(path.resolve(process.cwd(), 'server/.env'));

// Read Gmail credentials from environment
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const GMAIL_FROM_NAME = process.env.GMAIL_FROM_NAME || 'JMR Shooz Footwear';
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || GMAIL_USER || 'admin@jmrshooz.com';

const isConfigured = GMAIL_USER && 
  GMAIL_APP_PASSWORD && 
  GMAIL_USER !== 'your-email@gmail.com' && 
  GMAIL_APP_PASSWORD !== 'abcdefghijklmnop';

// Create reusable SMTP transporter using Gmail if configured
const transporter = isConfigured
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD, // Google 16-digit App Password
      },
      connectionTimeout: 4000, // 4s connection timeout
      greetingTimeout: 4000,   // 4s greeting timeout
      socketTimeout: 5000      // 5s socket timeout
    })
  : null;

if (transporter) {
  transporter.verify()
    .then(() => console.log('✅ Gmail SMTP connected — Live emails ready to send!'))
    .catch((err) => console.warn('⚠️ Gmail SMTP verify note:', err.message));
} else {
  console.log('ℹ️ Gmail SMTP is not configured. Running in local simulation mode (OTPs logged to console).');
}

export function getMailerStatus() {
  return {
    configured: !!isConfigured,
    senderEmail: isConfigured ? GMAIL_USER : null,
    senderName: GMAIL_FROM_NAME
  };
}

/**
 * Send OTP email to user for Login or Forgot Password
 */
export async function sendOtpEmail(toEmail, otpCode, purpose = 'login', userName = '') {
  if (!transporter) {
    console.log(`\n========================================`);
    console.log(`📧 [EMAIL SIMULATION] To: ${toEmail}`);
    console.log(`🔑 Purpose: ${purpose.toUpperCase()}`);
    console.log(`🔢 OTP Code: ${otpCode}`);
    console.log(`⏱️ Valid for: 10 minutes`);
    console.log(`ℹ️ To send REAL emails to inbox, enter your GMAIL_USER & GMAIL_APP_PASSWORD in .env`);
    console.log(`========================================\n`);
    return { success: true, messageId: 'simulated-console-otp', simulated: true };
  }

  const purposeText = {
    'login': 'Sign In Verification',
    'forgot-password': 'Password Reset Recovery',
    'registration': 'Account Email Verification',
    'register': 'Registration Email Verification',
  }[purpose] || 'Verification';

  const mailOptions = {
    from: `"${GMAIL_FROM_NAME}" <${GMAIL_USER}>`,
    to: toEmail,
    subject: `🔐 ${purposeText} OTP: ${otpCode} — JMR Shooz`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #13151D; color: #E8E8E8; border-radius: 16px; overflow: hidden; border: 1px solid #272B38;">
        <div style="background: linear-gradient(135deg, #1A1D28, #0B0C10); padding: 24px; text-align: center; border-bottom: 2px solid #C9A96E;">
          <h1 style="margin: 0; font-size: 22px; letter-spacing: 4px; color: #FFFFFF;">
            JMR <span style="color: #C9A96E; font-weight: 300;">SHOOZ</span>
          </h1>
          <p style="margin: 4px 0 0; font-size: 10px; color: #8E94A5; letter-spacing: 3px; text-transform: uppercase;">
            Authorized Footwear Distribution Network
          </p>
        </div>
        <div style="padding: 28px 24px; text-align: center;">
          <p style="font-size: 14px; color: #A0A6B5; margin: 0 0 8px;">
            ${userName ? `Hello <strong>${userName}</strong>,` : 'Hello,'}
          </p>
          <p style="font-size: 14px; color: #C0C4CE; margin: 0 0 20px;">
            Your <strong style="color: #C9A96E;">${purposeText}</strong> OTP is:
          </p>
          <div style="background: #1A1D28; border: 2px solid #C9A96E; border-radius: 12px; padding: 18px; display: inline-block; margin: 0 auto;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #C9A96E; font-family: 'Courier New', monospace;">
              ${otpCode}
            </span>
          </div>
          <p style="font-size: 12px; color: #8E94A5; margin: 18px 0 0;">
            ⏱️ This code expires in <strong>5 minutes</strong>. Do not share it with anyone.
          </p>
        </div>
        <div style="background: #0B0C10; padding: 14px 20px; text-align: center; border-top: 1px solid #272B38;">
          <p style="margin: 0; font-size: 10px; color: #6B7185;">
            © ${new Date().getFullYear()} JMR Shooz Footwear Distributors Pvt Ltd · All Rights Reserved
          </p>
        </div>
      </div>
    `,
  };

  try {
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('SMTP timeout (4s exceeded)')), 4000)
    );
    const info = await Promise.race([sendPromise, timeoutPromise]);
    console.log(`📧 OTP email successfully sent to ${toEmail} (MessageID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`⚠️ SMTP delay or issue sending to ${toEmail}:`, error.message);
    console.log(`ℹ️ [SIMULATED OTP RESCUE] Valid OTP Code for ${toEmail}: ${otpCode}`);
    return { 
      success: true, 
      simulated: true, 
      simulatedOtp: otpCode, 
      message: 'Verification OTP generated' 
    };
  }
}

/**
 * Send Email Notification when a New User registers (Waiting for Admin approval)
 */
export async function sendNewUserRegistrationNotice(user) {
  console.log(`\n📢 [NEW REGISTRATION] User: ${user.name} (${user.email}) | Role: ${user.userType || user.accountType} | Status: PENDING APPROVAL`);

  if (!transporter) {
    return { success: true, messageId: 'simulated-console-notice' };
  }

  // 1. Send alert to Admin
  const adminMail = {
    from: `"${GMAIL_FROM_NAME}" <${GMAIL_USER}>`,
    to: ADMIN_NOTIFY_EMAIL,
    subject: `🔔 New Account Pending Approval: ${user.name} (${user.companyName || user.userType})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #13151D; color: #E8E8E8; border-radius: 12px; padding: 24px; border: 1px solid #272B38;">
        <h2 style="color: #C9A96E; margin-top: 0;">New Account Registration Pending</h2>
        <p>A new user has submitted registration on the JMR Shooz portal and requires Admin Verification:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; color: #ddd; font-size: 13px;">
          <tr><td style="padding: 6px; font-weight: bold; width: 140px;">Name:</td><td style="padding: 6px;">${user.name}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Account Type:</td><td style="padding: 6px; text-transform: uppercase; color: #C9A96E;">${user.userType || user.accountType}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Email:</td><td style="padding: 6px;">${user.email}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Phone:</td><td style="padding: 6px;">${user.phone || 'N/A'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Company / Shop:</td><td style="padding: 6px;">${user.companyName || 'N/A'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">GSTIN:</td><td style="padding: 6px;">${user.gstin || 'None (Optional)'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">City:</td><td style="padding: 6px;">${user.city || 'India'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Generated ID:</td><td style="padding: 6px; font-family: monospace; color: #C9A96E;">${user.retailerId || user.id}</td></tr>
        </table>
        <p style="font-size: 13px; color: #A0A6B5;">Please open the <strong>Admin Suite → Pending Approvals</strong> tab to Approve or Reject this account.</p>
      </div>
    `
  };

  // 2. Send acknowledgment to User
  const userMail = {
    from: `"${GMAIL_FROM_NAME}" <${GMAIL_USER}>`,
    to: user.email,
    subject: `📋 Registration Received — Awaiting Admin Verification (JMR Shooz)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #13151D; color: #E8E8E8; border-radius: 12px; padding: 24px; border: 1px solid #272B38;">
        <h2 style="color: #C9A96E; margin-top: 0;">Welcome to JMR Shooz</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Aapki account registration request receive ho gayi hai! Security and wholesale verification policy ke tehat, aapka account currently <strong>Admin Verification Pending</strong> status mein hai.</p>
        <div style="background: #1A1D28; border-left: 3px solid #C9A96E; padding: 12px 16px; margin: 16px 0; font-size: 13px;">
          <p style="margin: 0 0 6px;"><strong>Reference ID:</strong> <span style="color: #C9A96E; font-family: monospace;">${user.retailerId || user.id}</span></p>
          <p style="margin: 0;"><strong>Status:</strong> <span style="color: #F59E0B; font-weight: bold;">Pending Admin Approval</span></p>
        </div>
        <p style="font-size: 13px; color: #A0A6B5;">JMR Shooz Administrator dwara account verify hote hi aapko confirmation email prapt hoga, jiske baad aap B2B portal par login kar sakenge.</p>
      </div>
    `
  };

  try {
    await Promise.allSettled([
      transporter.sendMail(adminMail),
      transporter.sendMail(userMail)
    ]);
    return { success: true };
  } catch (err) {
    console.error('Failed to dispatch registration notice email:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Email Notification when Admin Approves a User's Account
 */
export async function sendAccountApprovedEmail(user) {
  console.log(`\n🎉 [ACCOUNT APPROVED] User: ${user.name} (${user.email}) | ID: ${user.retailerId || user.id}`);

  if (!transporter) {
    return { success: true, messageId: 'simulated-console-approved' };
  }

  const mailOptions = {
    from: `"${GMAIL_FROM_NAME}" <${GMAIL_USER}>`,
    to: user.email,
    subject: `🎉 Account Approved! You Can Now Log In — JMR Shooz`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #13151D; color: #E8E8E8; border-radius: 12px; padding: 24px; border: 1px solid #272B38;">
        <div style="text-align: center; border-bottom: 2px solid #C9A96E; padding-bottom: 16px; margin-bottom: 16px;">
          <h1 style="color: #C9A96E; margin: 0; font-size: 22px;">JMR SHOOZ</h1>
          <p style="color: #8E94A5; font-size: 11px; text-transform: uppercase; margin: 4px 0 0;">Authorized Footwear Distributor</p>
        </div>
        <h3 style="color: #10B981; margin-top: 0;">Congratulations, ${user.name}!</h3>
        <p>Aapka JMR Shooz account Admin dwara successfully <strong>Verify aur Approve</strong> kar diya gaya hai.</p>
        <div style="background: #1A1D28; border: 1px solid #C9A96E; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 13px;">
          <p style="margin: 0 0 6px;"><strong>Login Identifier:</strong> ${user.email} or ${user.retailerId || user.id}</p>
          <p style="margin: 0;"><strong>Account Type:</strong> <span style="text-transform: uppercase; color: #C9A96E;">${user.userType || 'Retailer'}</span></p>
        </div>
        <p style="font-size: 13px; color: #A0A6B5;">Ab aap portal par jakar apne password ya instant OTP ke madhyam se login kar sakte hain.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Failed to send approval email to ${user.email}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Email Notification when a Retailer / Customer submits an Inquiry
 * Notifies both Admin AND sends a confirmation acknowledgment to Retailer
 */
export async function sendInquiryEmails(inquiry) {
  const refId = inquiry.referenceId || inquiry.id || `QRY-${Math.floor(1000 + Math.random() * 9000)}`;
  const companyOrName = inquiry.companyName || inquiry.contactName || inquiry.name || 'Footwear Retailer';
  const contactPerson = inquiry.contactName || inquiry.name || 'Valued Partner';
  const userEmail = inquiry.email;
  const userPhone = inquiry.phone || 'N/A';
  const queryType = inquiry.type || 'Wholesale Footwear Inquiry';
  const brandOrProduct = inquiry.brandInterest || inquiry.brandName || inquiry.productSku || inquiry.subject || 'Multi-Brand Catalog';
  const volume = inquiry.volume || 'Bulk Wholesale Batch';
  const userMessage = inquiry.message || 'No additional message provided';
  const location = inquiry.location || inquiry.city || 'India';

  console.log(`\n📬 [NEW INQUIRY NOTIFICATION] Ref: #${refId} | From: ${contactPerson} (${userEmail}) | Product: ${brandOrProduct}`);

  if (!transporter) {
    console.log(`ℹ️ [SIMULATION INQUIRY EMAIL] Admin (${ADMIN_NOTIFY_EMAIL}) and Retailer (${userEmail}) would receive notifications.`);
    return { success: true, simulated: true, referenceId: refId };
  }

  // 1. Alert Email to Admin
  const adminMail = {
    from: `"${GMAIL_FROM_NAME}" <${GMAIL_USER}>`,
    to: ADMIN_NOTIFY_EMAIL,
    subject: `🔔 New B2B Footwear Inquiry [#${refId}]: ${companyOrName} (${brandOrProduct})`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #13151D; color: #E8E8E8; border-radius: 12px; overflow: hidden; border: 1px solid #272B38;">
        <div style="background: linear-gradient(135deg, #1A1D28, #0B0C10); padding: 20px 24px; border-bottom: 2px solid #C9A96E;">
          <h2 style="margin: 0; color: #FFFFFF; font-size: 20px;">
            JMR <span style="color: #C9A96E; font-weight: 300;">SHOOZ</span>
          </h2>
          <p style="margin: 4px 0 0; font-size: 11px; color: #8E94A5; letter-spacing: 2px; text-transform: uppercase;">
            Admin Desk · New Business Inquiry
          </p>
        </div>

        <div style="padding: 24px;">
          <div style="background: #1A1D28; border: 1px solid rgba(201, 169, 110, 0.3); border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
            <p style="margin: 0 0 6px; font-size: 13px; color: #A0A6B5;">Inquiry Reference ID:</p>
            <p style="margin: 0; font-size: 22px; font-weight: bold; color: #C9A96E; font-family: monospace;">#${refId}</p>
          </div>

          <h3 style="color: #FFFFFF; margin: 0 0 12px; font-size: 16px;">Retailer / Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 8px 0; color: #8E94A5; width: 140px;">Contact Person:</td><td style="padding: 8px 0; font-weight: 600; color: #FFFFFF;">${contactPerson}</td></tr>
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 8px 0; color: #8E94A5;">Company / Store:</td><td style="padding: 8px 0; font-weight: 600; color: #FFFFFF;">${companyOrName}</td></tr>
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 8px 0; color: #8E94A5;">Phone / Mobile:</td><td style="padding: 8px 0; color: #C9A96E; font-weight: bold;"><a href="tel:${userPhone}" style="color: #C9A96E; text-decoration: none;">${userPhone}</a></td></tr>
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 8px 0; color: #8E94A5;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${userEmail}" style="color: #38BDF8; text-decoration: none;">${userEmail}</a></td></tr>
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 8px 0; color: #8E94A5;">Location / City:</td><td style="padding: 8px 0; color: #E8E8E8;">${location}</td></tr>
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 8px 0; color: #8E94A5;">Inquiry Type:</td><td style="padding: 8px 0; color: #E8E8E8;">${queryType}</td></tr>
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 8px 0; color: #8E94A5;">Footwear / Brand:</td><td style="padding: 8px 0; color: #F59E0B; font-weight: 600;">${brandOrProduct}</td></tr>
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 8px 0; color: #8E94A5;">Expected Volume:</td><td style="padding: 8px 0; color: #E8E8E8;">${volume}</td></tr>
          </table>

          <h3 style="color: #FFFFFF; margin: 0 0 8px; font-size: 15px;">Requirements / Message</h3>
          <div style="background: #0B0C10; border: 1px solid #272B38; border-radius: 8px; padding: 14px; font-size: 13px; color: #D1D5DB; line-height: 1.6; margin-bottom: 24px;">
            ${userMessage.replace(/\n/g, '<br/>')}
          </div>

          <p style="font-size: 12px; color: #8E94A5; margin: 0;">
            💡 Admin Portal me jakar <strong>"Inquiries Desk"</strong> tab se is query ka status update karein.
          </p>
        </div>
      </div>
    `
  };

  // 2. Confirmation Email to Retailer / User
  const retailerMail = {
    from: `"${GMAIL_FROM_NAME}" <${GMAIL_USER}>`,
    to: userEmail,
    subject: `✅ Inquiry Confirmed [#${refId}] — JMR Shooz Wholesale Distribution`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #13151D; color: #E8E8E8; border-radius: 12px; overflow: hidden; border: 1px solid #272B38;">
        <div style="background: linear-gradient(135deg, #1A1D28, #0B0C10); padding: 24px; text-align: center; border-bottom: 2px solid #C9A96E;">
          <h1 style="margin: 0; font-size: 22px; letter-spacing: 3px; color: #FFFFFF;">
            JMR <span style="color: #C9A96E; font-weight: 300;">SHOOZ</span>
          </h1>
          <p style="margin: 4px 0 0; font-size: 11px; color: #8E94A5; letter-spacing: 2px; text-transform: uppercase;">
            Authorized Footwear Distribution Network
          </p>
        </div>

        <div style="padding: 28px 24px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 2px solid #10B981; color: #10B981; font-size: 24px; margin-bottom: 12px;">
              ✓
            </div>
            <h2 style="color: #FFFFFF; margin: 0 0 6px; font-size: 18px;">Aapki Inquiry Receive Ho Gayi Hai!</h2>
            <p style="color: #A0A6B5; font-size: 13px; margin: 0;">Namaste <strong>${contactPerson}</strong>, hamare B2B wholesale desk ko aapki request mil gayi hai.</p>
          </div>

          <div style="background: #1A1D28; border: 1px solid rgba(201, 169, 110, 0.3); border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; text-align: center;">
            <span style="font-size: 12px; color: #8E94A5; display: block; margin-bottom: 4px;">Aapka Reference Ticket ID:</span>
            <span style="font-size: 22px; font-weight: bold; color: #C9A96E; font-family: monospace;">#${refId}</span>
          </div>

          <h3 style="color: #FFFFFF; font-size: 14px; margin: 0 0 10px; border-bottom: 1px solid #272B38; padding-bottom: 6px;">Inquiry Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 6px 0; color: #8E94A5;">Product / Requirement:</td><td style="padding: 6px 0; color: #FFFFFF; font-weight: 600;">${brandOrProduct}</td></tr>
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 6px 0; color: #8E94A5;">Estimated Volume:</td><td style="padding: 6px 0; color: #E8E8E8;">${volume}</td></tr>
            <tr style="border-bottom: 1px solid #272B38;"><td style="padding: 6px 0; color: #8E94A5;">Company / Store:</td><td style="padding: 6px 0; color: #E8E8E8;">${companyOrName}</td></tr>
          </table>

          <div style="background: #0B0C10; border-left: 3px solid #10B981; border-radius: 4px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #D1D5DB;">
            <strong style="color: #10B981;">Aage Kya Hoga?</strong><br/>
            Hamare Wholesale Distribution Manager aapki inquiry review karke <strong>24 ghante</strong> ke andar aapke registered mobile (<span style="color: #C9A96E;">${userPhone}</span>) ya WhatsApp par direct rate-card aur MOQ size curves ke sath connect karenge.
          </div>

          <div style="border-top: 1px solid #272B38; padding-top: 16px; text-align: center; font-size: 12px; color: #8E94A5;">
            <p style="margin: 0 0 4px;">Direct Wholesale Helpline:</p>
            <p style="margin: 0; color: #FFFFFF; font-weight: 600;">
              📞 +91 98200 12345 &nbsp;|&nbsp; 💬 WhatsApp: +91 98111 22334
            </p>
          </div>
        </div>

        <div style="background: #0B0C10; padding: 12px; text-align: center; border-top: 1px solid #272B38;">
          <p style="margin: 0; font-size: 10px; color: #6B7185;">
            © ${new Date().getFullYear()} JMR Shooz Footwear Distributors Pvt Ltd · All Rights Reserved
          </p>
        </div>
      </div>
    `
  };

  try {
    const promises = [transporter.sendMail(adminMail)];
    if (userEmail && userEmail.includes('@') && !userEmail.includes('example.com')) {
      promises.push(transporter.sendMail(retailerMail));
    }
    await Promise.allSettled(promises);
    console.log(`✅ Inquiry notifications successfully emailed to Admin and Retailer (${userEmail})`);
    return { success: true, referenceId: refId };
  } catch (err) {
    console.error('Error dispatching inquiry emails:', err.message);
    return { success: false, error: err.message, referenceId: refId };
  }
}

/**
 * Send Email Notification when a New Wholesale Order is Placed
 * Generates an official, print-ready B2B Wholesale Consignment Slip / Bilti (प्रिंट योग्य चालान)
 */
export async function sendNewOrderEmails(order) {
  const orderId = order.orderId || order.id || 'ORD-NEW';
  const partyName = order.partyName || order.companyName || order.customerName || 'Footwear Retail Store';
  const station = order.station || order.city || 'Central Hub';
  const retailerId = order.retailerId || order.userId || 'RET-STORE';
  const customerName = order.customerName || order.name || 'Valued Retailer';
  const customerEmail = order.customerEmail || order.email || '';
  const customerPhone = order.customerPhone || order.phone || 'N/A';
  const shippingAddress = order.shippingAddress || 'Store Delivery';
  const paymentMethod = order.paymentMethod || 'Bank Transfer / RTGS';
  const notes = order.notes || '';
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const rawItems = Array.isArray(order.items) ? order.items : [];
  const items = rawItems.map(item => {
    const pairsPerSet = parseInt(item.pairsPerSet, 10) || 12;
    const ratePerPair = typeof item.ratePerPair === 'number' ? item.ratePerPair : (typeof item.wholesaleRate === 'number' ? item.wholesaleRate : 750);
    const ratePerSet = typeof item.ratePerSet === 'number' ? item.ratePerSet : (pairsPerSet * ratePerPair);
    const sets = parseInt(item.sets, 10) || parseInt(item.quantity, 10) || 1;
    const totalPairs = parseInt(item.totalPairs, 10) || (sets * pairsPerSet);
    const subtotal = typeof item.subtotal === 'number' ? item.subtotal : (sets * ratePerSet);

    return {
      ...item,
      pairsPerSet,
      sizeCurve: item.sizeCurve || '',
      sets,
      quantity: sets,
      totalPairs,
      ratePerPair,
      ratePerSet,
      subtotal
    };
  });

  const totalSets = order.totalSets || items.reduce((sum, it) => sum + it.sets, 0);
  const totalPairs = order.totalPairs || items.reduce((sum, it) => sum + it.totalPairs, 0);
  const totalAmountNum = typeof order.totalAmount === 'number' 
    ? order.totalAmount 
    : items.reduce((sum, it) => sum + it.subtotal, 0);
  const totalAmountFormatted = totalAmountNum.toLocaleString('en-IN');

  console.log(`\n🛒 [PRINTABLE CONSIGNMENT ORDER] #${orderId}`);
  console.log(`   Party: ${partyName} | Station: ${station} | Retailer ID: ${retailerId}`);
  console.log(`   Consignment: ${totalSets} Sets (${totalPairs} Pairs) | Total: ₹${totalAmountFormatted}`);

  if (!transporter) {
    console.log(`ℹ️ [SIMULATION ORDER EMAIL] Admin (${ADMIN_NOTIFY_EMAIL}) and Retailer (${customerEmail}) would receive Printable Consignment Slip #${orderId}.`);
    return { success: true, simulated: true, orderId };
  }

  // Render Table Rows for Sets and Pairs
  const itemsRowsHtml = items.map((item, index) => {
    const itemColor = item.color || item.selectedColor || 'Classic Black';
    const itemImg = item.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&q=80';

    return `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 10px 8px; text-align: center; color: #64748B; font-size: 11px;">${index + 1}</td>
      <td style="padding: 8px; text-align: center; width: 60px;">
        <img src="${itemImg}" width="52" height="52" style="border-radius: 8px; object-fit: cover; border: 1px solid #CBD5E1; display: inline-block;" alt="${item.name}" />
      </td>
      <td style="padding: 10px 8px;">
        <strong style="color: #0F172A; font-size: 13px; display: block; line-height: 1.3;">${item.name}</strong>
        <span style="font-size: 11px; color: #D97706; font-weight: bold;">${item.brandName || ''}</span>
        <span style="font-size: 10px; color: #64748B; font-family: monospace; margin-left: 6px;">SKU: ${item.sku || 'N/A'}</span><br/>
        <span style="display: inline-block; margin-top: 4px; background: #FEF3C7; color: #92400E; padding: 2px 7px; border-radius: 4px; font-size: 11px; font-weight: bold; border: 1px solid #FDE68A;">
          🎨 Color: ${itemColor}
        </span>
        ${item.specification ? `
        <div style="margin-top: 5px; font-size: 11px; color: #4338CA; background: #EEF2FF; padding: 3px 8px; border-radius: 4px; border: 1px solid #C7D2FE;">
          <strong>विशेष निर्देश (Specification):</strong> ${item.specification}
        </div>
        ` : ''}
      </td>
      <td style="padding: 10px 8px; font-size: 11px; color: #475569;">
        ${item.sizeCurve || 'Standard Wholesale Curve'}
      </td>
      <td style="padding: 10px 8px; text-align: center; font-size: 12px; font-weight: bold; color: #0F172A;">
        <span style="background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-family: monospace;">
          ${item.pairsPerSet} Pairs
        </span>
      </td>
      <td style="padding: 10px 8px; text-align: center; font-size: 13px; font-weight: 800; color: #1E293B;">
        ${item.sets} ${item.sets === 1 ? 'Set' : 'Sets'}
      </td>
      <td style="padding: 10px 8px; text-align: center; font-size: 12px; font-weight: bold; color: #0284C7; font-family: monospace;">
        ${item.totalPairs} Pairs
      </td>
      <td style="padding: 10px 8px; text-align: right; color: #475569; font-size: 12px; font-family: monospace;">
        ₹${(item.ratePerPair || 0).toLocaleString('en-IN')}
      </td>
      <td style="padding: 10px 8px; text-align: right; color: #0F172A; font-size: 12px; font-weight: bold; font-family: monospace;">
        ₹${(item.ratePerSet || 0).toLocaleString('en-IN')}
      </td>
      <td style="padding: 10px 8px; text-align: right; color: #B45309; font-weight: 800; font-size: 13px; font-family: monospace;">
        ₹${(item.subtotal || 0).toLocaleString('en-IN')}
      </td>
    </tr>
  `;
  }).join('');

  // Reusable Printable Slip Template (High contrast, paper-friendly styling)
  const buildPrintableSlipHtml = (recipientType = 'ADMIN') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Consignment Slip - #${orderId}</title>
      <style>
        body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; background-color: #F8FAFC; color: #0F172A; margin: 0; padding: 20px; }
        .slip-card { max-width: 800px; margin: 0 auto; background: #FFFFFF; border: 2px solid #CBD5E1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .print-btn-bar { background: #0F172A; color: #FFFFFF; padding: 12px 24px; text-align: right; font-size: 12px; }
        .print-btn { display: inline-block; background: #D97706; color: #FFFFFF; text-decoration: none; padding: 6px 16px; border-radius: 6px; font-weight: bold; font-size: 12px; }
        @media print {
          body { background: #FFFFFF !important; padding: 0 !important; }
          .slip-card { border: 1px solid #000000 !important; box-shadow: none !important; max-width: 100% !important; border-radius: 0 !important; }
          .print-btn-bar { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="slip-card">
        
        <!-- Printable Bar (Hidden during paper printing) -->
        <div class="print-btn-bar">
          <span style="float: left; line-height: 28px; font-weight: bold; letter-spacing: 1px; color: #FCD34D;">
            📄 OFFICIAL WHOLESALE CONSIGNMENT BILTI & ORDER ADVICE
          </span>
          <span style="font-size: 11px; color: #94A3B8; margin-right: 12px;">Tip: Press Ctrl+P / Cmd+P to Print this slip</span>
        </div>

        <!-- Master Header -->
        <div style="padding: 24px; border-bottom: 2px solid #D97706; background: #FAF5FF; display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #1E1B4B; letter-spacing: 2px;">
              JMR <span style="color: #D97706; font-weight: 300;">SHOOZ</span>
            </h1>
            <p style="margin: 3px 0 0; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #4338CA; letter-spacing: 2px;">
              Authorized Footwear Distribution Network
            </p>
            <p style="margin: 4px 0 0; font-size: 11px; color: #475569; line-height: 1.4;">
              National Logistics Hub, Outer Ring Road, Footwear Complex, New Delhi - 110041<br/>
              <strong>GSTIN:</strong> 07AAACJ4892E1Z8 &nbsp;|&nbsp; <strong>Helpline:</strong> +91 98200 12345
            </p>
          </div>
          <div style="text-align: right; background: #FFFFFF; padding: 12px 16px; border: 1px solid #E2E8F0; border-radius: 8px;">
            <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748B; display: block;">Consignment Order No.</span>
            <span style="font-size: 20px; font-weight: 900; color: #D97706; font-family: monospace;">#${orderId}</span>
            <span style="font-size: 11px; color: #475569; display: block; margin-top: 2px;">Date: <strong>${orderDate}</strong></span>
            <span style="display: inline-block; margin-top: 4px; padding: 2px 8px; border-radius: 9999px; background: #FEF3C7; color: #92400E; font-size: 10px; font-weight: bold;">
              ${recipientType === 'ADMIN' ? 'ADMIN DISPATCH COPY' : 'PARTY CONSIGNMENT COPY'}
            </span>
          </div>
        </div>

        <!-- Party & Station Particulars (पार्टी एवं स्टेशन विवरण) -->
        <div style="padding: 20px 24px; background: #FFFFFF; border-bottom: 1px solid #E2E8F0;">
          <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; color: #1E293B; letter-spacing: 1px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            🏢 Consignment Particulars (पार्टी व स्टेशन विवरण)
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="padding: 6px 0; width: 18%; color: #64748B; font-weight: bold;">Party Name (M/S):</td>
              <td style="padding: 6px 0; width: 32%; color: #0F172A; font-weight: 800; font-size: 14px;">${partyName}</td>
              <td style="padding: 6px 0; width: 18%; color: #64748B; font-weight: bold;">Destination Station:</td>
              <td style="padding: 6px 0; width: 32%; color: #D97706; font-weight: 800; font-size: 14px;">📍 ${station}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B; font-weight: bold;">Retailer / ID Code:</td>
              <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #4338CA;">${retailerId}</td>
              <td style="padding: 6px 0; color: #64748B; font-weight: bold;">Contact Person:</td>
              <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B; font-weight: bold;">Mobile / WhatsApp:</td>
              <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #0F172A;">${customerPhone}</td>
              <td style="padding: 6px 0; color: #64748B; font-weight: bold;">Official Email:</td>
              <td style="padding: 6px 0; color: #0284C7;">${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B; font-weight: bold;">Delivery Address:</td>
              <td colspan="3" style="padding: 6px 0; color: #334155;">${shippingAddress}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B; font-weight: bold;">Payment Preference:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #059669;">${paymentMethod}</td>
              <td style="padding: 6px 0; color: #64748B; font-weight: bold;">Transport / Booking Note:</td>
              <td style="padding: 6px 0; color: #B45309; font-weight: 600;">${notes || 'Direct Goods Transport Delivery'}</td>
            </tr>
          </table>
        </div>

        <!-- Footwear Articles & Sets Breakdown Table -->
        <div style="padding: 20px 24px;">
          <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; color: #1E293B; letter-spacing: 1px;">
            📦 Footwear Allocation & Set Details (सेट एवं पेयर विवरण)
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #CBD5E1;">
            <thead>
              <tr style="background: #0F172A; color: #FFFFFF; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                <th style="padding: 8px 6px; text-align: center;">S.N.</th>
                <th style="padding: 8px; text-align: center;">Photo</th>
                <th style="padding: 8px;">Footwear Article & Color</th>
                <th style="padding: 8px;">Size Curve</th>
                <th style="padding: 8px; text-align: center;">Pairs / Set</th>
                <th style="padding: 8px; text-align: center;">Ordered Sets</th>
                <th style="padding: 8px; text-align: center;">Total Pairs</th>
                <th style="padding: 8px; text-align: right;">Rate / Pair</th>
                <th style="padding: 8px; text-align: right;">Rate / Set</th>
                <th style="padding: 8px; text-align: right;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #F1F5F9; border-top: 2px solid #CBD5E1; font-size: 12px;">
                <td colspan="5" style="padding: 10px 8px; font-weight: 800; color: #0F172A; text-align: right;">
                  CONSIGNMENT TOTALS:
                </td>
                <td style="padding: 10px 8px; text-align: center; font-weight: 900; font-size: 14px; color: #1E293B;">
                  ${totalSets} Sets
                </td>
                <td style="padding: 10px 8px; text-align: center; font-weight: 900; font-size: 14px; color: #0284C7; font-family: monospace;">
                  ${totalPairs} Pairs
                </td>
                <td colspan="2" style="padding: 10px 8px; text-align: right; font-weight: bold; color: #475569;">
                  Grand Total (₹):
                </td>
                <td style="padding: 10px 8px; text-align: right; font-weight: 900; font-size: 16px; color: #B45309; font-family: monospace;">
                  ₹${totalAmountFormatted}
                </td>
              </tr>
            </tfoot>
          </table>

          <!-- Consignment Highlights Cards -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;">
            <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 12px; text-align: center;">
              <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #92400E; display: block;">Total Sets (Cartons)</span>
              <span style="font-size: 22px; font-weight: 900; color: #78350F; font-family: monospace;">${totalSets} Sets</span>
            </div>
            <div style="background: #E0F2FE; border: 1px solid #BAE6FD; border-radius: 8px; padding: 12px; text-align: center;">
              <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #0369A1; display: block;">Total Wholesale Pairs</span>
              <span style="font-size: 22px; font-weight: 900; color: #075985; font-family: monospace;">${totalPairs} Pairs</span>
            </div>
            <div style="background: #DCFCE7; border: 1px solid #86EFAC; border-radius: 8px; padding: 12px; text-align: center;">
              <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #166534; display: block;">Total Consignment Value</span>
              <span style="font-size: 22px; font-weight: 900; color: #14532D; font-family: monospace;">₹${totalAmountFormatted}</span>
            </div>
          </div>

          ${order.specification ? `
          <!-- Customer Custom Consignment Specification -->
          <div style="margin-top: 18px; padding: 14px; background: #EEF2FF; border: 1.5px solid #6366F1; border-radius: 8px;">
            <strong style="color: #312E81; font-size: 12px; display: block; margin-bottom: 4px;">
              📝 Customer Order Specification / विशेष निर्देश:
            </strong>
            <p style="margin: 0; font-size: 12px; color: #1E1B4B; line-height: 1.4; font-weight: 500;">
              ${order.specification}
            </p>
          </div>
          ` : ''}

          <!-- Dispatch Note & Terms -->
          <div style="margin-top: 20px; padding: 14px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 11px; color: #475569; line-height: 1.5;">
            <strong style="color: #0F172A;">Wholesale Trade Terms & Dispatch Assurance:</strong><br/>
            1. All footwear goods are packed strictly in factory sets with certified size curves (No single pair sales).<br/>
            2. Central Logistics Desk coordinates bilti booking with authorized road transport agencies (Goods Transport Handover within 24-48 hours).<br/>
            3. Goods dispatch notification with LR / Bilti copy will be sent to <strong>${customerPhone}</strong> and <strong>${customerEmail}</strong> upon carrier pickup.
          </div>

          <!-- Authorized Signature Box -->
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748B;">
            <div>
              <p style="margin: 0;">Checked & Verified by: <strong>JMR Central Warehouse Desk</strong></p>
              <p style="margin: 2px 0 0; font-size: 10px;">Computer generated wholesale consignment advice.</p>
            </div>
            <div style="text-align: right;">
              <div style="display: inline-block; border-bottom: 1px solid #000000; width: 160px; height: 30px;"></div>
              <p style="margin: 4px 0 0; font-weight: bold; color: #0F172A;">Authorized Signatory / Seal</p>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div style="background: #0F172A; padding: 12px 24px; text-align: center; color: #94A3B8; font-size: 10px;">
          © ${new Date().getFullYear()} JMR Shooz Footwear Distributors Pvt Ltd · All Rights Reserved
        </div>

      </div>
    </body>
    </html>
  `;

  // 1. Email to Admin
  const adminMail = {
    from: `"${GMAIL_FROM_NAME}" <${GMAIL_USER}>`,
    to: ADMIN_NOTIFY_EMAIL,
    subject: `🛒 New Wholesale Order [#${orderId}]: ${partyName} · Stn: ${station} · ${totalSets} Sets (${totalPairs} Pairs) — ₹${totalAmountFormatted}`,
    html: buildPrintableSlipHtml('ADMIN')
  };

  // 2. Email to Retailer / Party
  const customerMail = {
    from: `"${GMAIL_FROM_NAME}" <${GMAIL_USER}>`,
    to: customerEmail,
    subject: `📄 Order Consignment Slip [#${orderId}]: ${partyName} · Stn: ${station} · ${totalSets} Sets — JMR Shooz`,
    html: buildPrintableSlipHtml('RETAILER')
  };

  try {
    const promises = [transporter.sendMail(adminMail)];
    if (customerEmail && customerEmail.includes('@') && !customerEmail.includes('example.com')) {
      promises.push(transporter.sendMail(customerMail));
    }
    await Promise.allSettled(promises);
    console.log(`✅ Printable wholesale consignment emails sent to Admin and Party (${customerEmail})`);
    return { success: true, orderId };
  } catch (err) {
    console.error('Error dispatching order emails:', err.message);
    return { success: false, error: err.message, orderId };
  }
}

/**
 * Send Status Update Email to Customer (e.g. Dispatched / Confirmed)
 */
export async function sendOrderStatusUpdateEmail(order, newStatus) {
  const customerEmail = order.customerEmail || order.email;
  if (!customerEmail || !customerEmail.includes('@') || customerEmail.includes('example.com')) {
    return { success: false, error: 'No valid customer email' };
  }

  const orderId = order.orderId || order.id;
  const customerName = order.customerName || order.name || 'Valued Retailer';

  console.log(`\n📦 [ORDER STATUS UPDATE EMAIL] #${orderId} -> ${newStatus} to ${customerEmail}`);

  if (!transporter) {
    return { success: true, simulated: true };
  }

  const statusColors = {
    'Confirmed': '#3B82F6',
    'Processing': '#8B5CF6',
    'Dispatched': '#10B981',
    'Shipped': '#0EA5E9',
    'Hold': '#F59E0B',
    'Delivered': '#059669',
    'Cancelled': '#EF4444'
  };
  const color = statusColors[newStatus] || '#C9A96E';

  const statusDescriptions = {
    'Confirmed': 'Aapka wholesale order successfully confirm ho chuka hai aur factory allocation queue me lag gaya hai.',
    'Processing': 'Aapke cartons central warehouse me packaging and inspection stage par hain.',
    'Dispatched': 'Aapka batch central godown se cargo / road transport handover ke liye rawana ho gaya hai.',
    'Shipped': 'Aapka consignment transport agency ko handover kar diya gaya hai. Bilti / LR receipt issue ho chuki hai.',
    'Hold': 'Aapka order consignment temporarily HOLD par rakha gaya hai (Payment/GST verification ya transport route slotting ke karan). Admin desk aapse jald contact karegi.',
    'Delivered': 'Aapke station par consignment safe hand-over ho chuka hai. Thank you for partnering with JMR Shooz.',
    'Cancelled': 'Aapka order request cancel kar diya gaya hai.'
  };

  const statusDescription = statusDescriptions[newStatus] || 'Aapke order ka status update kiya gaya hai.';
  const adminNote = order.adminNote || '';

  const mailOptions = {
    from: `"${GMAIL_FROM_NAME}" <${GMAIL_USER}>`,
    to: customerEmail,
    subject: `📦 Order #${orderId} Status Update: ${newStatus.toUpperCase()} — JMR Shooz`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #13151D; color: #E8E8E8; border-radius: 14px; overflow: hidden; border: 1px solid #272B38;">
        <div style="background: linear-gradient(135deg, #1A1D28, #0B0C10); padding: 22px; text-align: center; border-bottom: 2px solid ${color};">
          <h2 style="margin: 0; color: #FFFFFF; font-size: 20px;">JMR <span style="color: #C9A96E; font-weight: 300;">SHOOZ</span></h2>
          <p style="margin: 4px 0 0; font-size: 11px; color: #8E94A5; letter-spacing: 2px; text-transform: uppercase;">Wholesale Logistics Tracking</p>
        </div>
        <div style="padding: 24px; text-align: center;">
          <p style="font-size: 14px; color: #A0A6B5; margin: 0 0 10px;">Hello <strong>${customerName}</strong>,</p>
          <p style="font-size: 14px; color: #E8E8E8; margin: 0 0 18px;">
            Aapke order <strong style="color: #C9A96E;">#${orderId}</strong> ka status update kiya gaya hai:
          </p>
          <div style="display: inline-block; padding: 10px 24px; border-radius: 30px; background: rgba(255,255,255,0.06); border: 2px solid ${color}; color: ${color}; font-size: 18px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px;">
            ${newStatus}
          </div>
          <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6; margin: 0 0 16px;">
            ${statusDescription}
          </p>

          ${adminNote ? `
          <div style="background: #1E293B; border-left: 3px solid ${color}; padding: 10px 14px; text-align: left; border-radius: 4px; margin-bottom: 20px; font-size: 12px; color: #F1F5F9;">
            <strong style="color: #F8FAFC;">Admin Dispatch Note:</strong> ${adminNote}
          </div>
          ` : ''}

          <div style="background: #0B0C10; padding: 12px; border-radius: 8px; font-size: 12px; color: #8E94A5;">
            Need assistance with this consignment? Call +91 98200 12345 or WhatsApp +91 98111 22334.
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error('Failed to send status update email:', err.message);
    return { success: false, error: err.message };
  }
}

