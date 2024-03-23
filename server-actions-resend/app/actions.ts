"use server";

// import { Resend } from "resend";
import type { UsernameRequestForm } from "./types";
// import EmailTemplate from "@/emails/email-template";

// const resend = new Resend(process.env.RESEND_API_KEY);

// function getCurrentUser() {
//   return "sosa@webscope.io";
// }

export async function claimUsername(form: UsernameRequestForm) {
  // const userEmail = getCurrentUser();
  // const { error } = await resend.emails.send({
  //   from: "From webscope.io <hello@webscope.io>",
  //   to: [userEmail],
  //   subject: "Thank you for your message!",
  //   text: "We will reach out to you shortly",
  //   react: EmailTemplate(form),
  // });

  // if (error) {
  //   throw error;
  // }

  // return form;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (Math.random() < 0.3) {
    console.error(form);
    throw Error("Operation failed");
  }

  return form;
}
