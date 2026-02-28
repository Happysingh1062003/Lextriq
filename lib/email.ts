import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(email: string, code: string) {
  const from = process.env.SMTP_USER;

  if (!from) {
    throw new Error("SMTP_USER is not configured in .env");
  }

  const info = await transporter.sendMail({
    from: `Lextriq <${from}>`,
    to: email,
    subject: "Your Lextriq verification code",
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 460px; margin: 0 auto; padding: 40px 24px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #18181b; margin: 0 0 8px;">
          Verify your email
        </h2>
        <p style="font-size: 14px; color: #71717a; margin: 0 0 28px; line-height: 1.5;">
          Enter this code to complete your Lextriq signup. It expires in 10 minutes.
        </p>
        <div style="background: #f4f4f5; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #18181b;">
            ${code}
          </span>
        </div>
        <p style="font-size: 13px; color: #a1a1aa; margin: 0; line-height: 1.5;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  console.log(`[EMAIL] OTP sent successfully to ${email}, id: ${info.messageId}`);
}
