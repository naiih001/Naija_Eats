// import transporter from "../config/mail";
import emailjs from "@emailjs/nodejs";

const FROM_EMAIL =
  process.env.EMAIL_FROM || "Naija Eats <naija-eats@no-reply.com>";

// Initialize EmailJS
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY!,
  privateKey: process.env.EMAILJS_PRIVATE_KEY!,
});

const EMAILJS_SERVICE_ID = "service_t4xoffb";
const EMAILJS_TEMPLATE_ID_VERIFY = "template_867634j";
const EMAILJS_TEMPLATE_ID_RESET = "template_867634j";

export const sendVerificationEmail = async (email: string, token: string) => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
  const verificationUrl = `${backendUrl}/auth/verify-email/${token}`;

  try {
    /*
    // Old Nodemailer implementation
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your email address",
      html: `
        <h1>Welcome to Naija Eats!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
    });
    return { success: true, data: info };
    */

    // New EmailJS implementation
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        email: email,
        url: verificationUrl,
        from_name: "Naija Eats",
      },
    );

    return { success: true, data: response };
  } catch (err) {
    console.error("Exception sending verification email:", err);
    return { success: false, error: err };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  try {
    /*
    // Old Nodemailer implementation
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to set a new one:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      `,
    });
    return { success: true, data: info };
    */

    // New EmailJS implementation
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        email: email,
        url: resetUrl,
        from_name: "Naija Eats",
      },
    );

    return { success: true, data: response };
  } catch (err) {
    console.error("Exception sending password reset email:", err);
    return { success: false, error: err };
  }
};
