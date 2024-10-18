import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "email.service.webflows@gmail.com",
    pass: "pegpvpsgdibjvmph",
  },
});

export async function sendEmail(to: string, subject: string, body: string) {
  await transport.sendMail({
    from: "email.service.webflows@gmail.com",
    sender: "email.service.webflows@gmail.com",
    to,
    subject: subject,
    text: body,
  });
  console.log("email sent");
}
