import nodemailer from "nodemailer";

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null =
  null;

const getEmailTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.GOOGLE_EMAIL_ADDRESS;
  const pass = process.env.GOOGLE_EMAIL_KEY;
  if (!user || !pass) {
    throw new Error(
      "Missing GOOGLE_EMAIL_ADDRESS/GOOGLE_EMAIL_KEY for sending email.",
    );
  }

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return cachedTransporter;
};

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = getEmailTransporter();
  const from = process.env.GOOGLE_EMAIL_ADDRESS;

  try {
    return await transporter.sendMail({
      from: `RadDent <${from}>`,
      to,
      subject,
      html,
    });
  } catch (error: unknown) {
    console.error("Email sending failed:", (error as Error).message);
    throw error;
  }
};