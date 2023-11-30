import nodemailer from "nodemailer";

// export const sendEmail = async (option) =>{
//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.EMAIL_HOST,
//             port: process.env.EMAIL_PORT,
//             auth:{
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });

//         //Define Email Options
//         const emailOptions = {
//             from: 'Gshop support<support@gshop.com>',
//             to:option.email,
//             subject: option.subject,
//             text: option.message
//         }

//         //Create a transporter
//         await transporter.sendMail(emailOptions)
//     } catch (error) {
//         console.log(error)
//     }

// }

export const sendEmail = async (subject, to, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    to,
    subject,
    text,
  });
};
