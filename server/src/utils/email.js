import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async(to, subject, text) => {
  try{
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text
    });
  }catch(err){
    console.error("Email failed:", err);
  }
};
