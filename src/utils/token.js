import DataUriParser from "datauri/parser.js";
import path from "path";
import { MailtrapClient } from "mailtrap";
// import { createTransport } from "nodemailer";
import postmark from "postmark";
import * as dotenv from "dotenv";
dotenv.config();

export const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export const sendToken = (user, res, message, statuscode) => {
  const token = user.generateToken();

  res
    .status(statuscode)
    .cookie("token", token, {
      ...cookieOptions,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      message: message,
      token,
    });
};

export const cookieOptions = {
  secure: true,
  httpOnly: true,
};

//sending email
// export const sendEmail = async (subject, to, text) => {
//   let transporter = createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: true,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   await transporter.sendMail({
//     to,
//     subject,
//     text,
//   });
// };


