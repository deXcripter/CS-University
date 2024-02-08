import nodemailer from 'nodemailer';
import { iEnv, iEmail } from './interfaces';

export const sendEmail = async (options: iEmail) => {
  const transporter = nodemailer.createTransport({
    host: (process.env as any as iEnv).NODEMAILER_HOST,
    port: (process.env as any as iEnv).NODEMAILER_PORT,
    auth: {
      user: (process.env as any as iEnv).NODEMAILER_USERNAME,
      pass: (process.env as any as iEnv).NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    subject: 'Token expires in 5 minutes',
    from: 'Johnpaul Nnaji',
    to: options.email,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
