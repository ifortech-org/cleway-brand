import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const mailSenderAccount = {
  user: process.env.MAIL_SENDER_ACCOUNT_USERNAME,
  pass: process.env.MAIL_SENDER_ACCOUNT_PASSWORD,
  email: process.env.MAIL_SENDER_ACCOUNT_EMAIL,
};

export async function POST(request: Request) {
  try {
    const {
      email,
      name,
      surname,
      business_name,
      request: subject,
      description,
    } = await request.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
      auth: {
        user: mailSenderAccount.user,
        pass: mailSenderAccount.pass,
      },
    });

    if ( !email || !name || !surname || !business_name || !subject || !description ) {
      return new Response("Missing required fields", { status: 400 });
    }

    if (!mailSenderAccount.user || !mailSenderAccount.pass || !mailSenderAccount.email) {
      return new Response("Email configuration missing", { status: 500 });
    }
    
    // Email to admin
    const mailData = {
      from: mailSenderAccount.email,
      to: mailSenderAccount.email,
      subject: `CLEWAY - Richiesta di contatto da ${name} ${surname} - ${business_name}`,
      html: `
        <div>
          <h1>Nuova richiesta di contatto</h1>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Cognome:</strong> ${surname}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Azienda:</strong> ${business_name}</p>
          <p><strong>Oggetto della richiesta:</strong> ${subject}</p>
          <p><strong>Descrizione:</strong></p>
          <p>${description}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailData);

    // Confirmation email to user
    const mailDataUser = {
      from: mailSenderAccount.email,
      to: email,
      subject: `Riepilogo richiesta di contatto - CLEWAY`,
      html: `
        <div>
          <h1>CLEWAY</h1>
          <div>
            <p>
              Gentile ${name} ${surname}, <br>
              Grazie per averci contattato. Di seguito il riepilogo della tua richiesta: <br>
              <br>
              <strong>Oggetto:</strong> ${subject} <br>
              <strong>Messaggio:</strong> ${description} <br>
              <br>
              Ti contatteremo al più presto. <br><br>
              Cordiali saluti, <br><br>
              Il Team di Cleway
            </p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailDataUser);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
