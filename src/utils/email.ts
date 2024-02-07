import nodemailer from 'nodemailer';
import { iEnv, iOptions } from './interfaces';

export const sendEmail = async (options: iOptions) => {
  const transporter = nodemailer.createTransport({
    host: (process.env as any as iEnv).HOST,
    port: (process.env as any as iEnv).PORT,
    auth: {
      pass: (process.env as any as iEnv).NODEMAILER_PASSWORD,
      user: (process.env as any as iEnv).NODEMAILER_USERNAME,
    },
  });

  const mailOptions = {
    from: 'Johnpaul Nnaji',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
  console.log('mail sent');
};
