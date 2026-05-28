import transporter from "../config/mail";

const FROM_EMAIL =
  process.env.EMAIL_FROM || "Naija Eats <naija-eats@no-reply.com>";

export const sendVerificationEmail = async (email: string, token: string) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
  const verificationUrl = `${backendUrl}/auth/verify-email/${token}`;


  try {
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
  } catch (err) {
    console.error("Exception sending verification email:", err);
    return { success: false, error: err };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  try {
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
  } catch (err) {
    console.error("Exception sending password reset email:", err);
    return { success: false, error: err };
  }
};
