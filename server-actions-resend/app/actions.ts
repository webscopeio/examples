"use server";

import { FormFields } from "./types";
// import { Resend } from "resend";
// import EmailTemplate from "@/emails/email-template";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(form: FormFields) {
  // const { error } = await resend.emails.send({
  //   from: "Hector from webscope.io <sosa@webscope.io>",
  //   to: [form.email],
  //   subject: "Thank you for your message!",
  //   text: "We will reach out to you shortly",
  //   react: EmailTemplate(form),
  // });

  // if (error) {
  //   throw error;
  // }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (Math.random() < 0.3) {
    console.error(form);
    throw Error("Operation failed");
  }

  console.log(form);
}
