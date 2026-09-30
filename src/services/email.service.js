import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email connection error:", error);
  } else {
    console.log("Email server is ready");
  }
});

// Send email function
const sendEmail = async (to, subject, text, html) => {
  if (!to || typeof to !== "string" || !to.trim()) {
    throw new Error("Recipient email is required");
  }

  try {
    const info = await transporter.sendMail({
      from: `"Transaction System Bank" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Registration email
async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Transaction System Bank";
console.log("Sending registration email to:", userEmail);
  const text = `Hello ${name},

Thank you for registering with Transaction System Bank.`;

  const html = `
    <h2>Hello ${name},</h2>
    <p>Thank you for registering with
    Transaction System Bank.</p>
    <p>Welcome aboard!</p>
  `;

  return await sendEmail(userEmail, subject, text, html);
}

export default { sendRegistrationEmail };