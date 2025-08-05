// src/app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, subject, message, attachments } = await request.json();

    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true dla portu 465, false dla innych
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const formattedSubject = `[F] ${subject} | ${email}`;

    // Tworzenie maila w HTML
    const htmlBody = `
      <h2>Nowa wiadomość z formularza kontaktowego</h2>
      <p><strong>Od:</strong> ${email}</p>
      <p><strong>Temat:</strong> ${subject}</p>
      <hr>
      <p><strong>Wiadomość:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
      ${attachments.length > 0 ? `
        <hr>
        <p><strong>Załączniki:</strong></p>
        <ul>
          ${attachments.map((att: { name: string; url: string }) => `<li><a href="${att.url}">${att.name}</a></li>`).join('')}
        </ul>
      ` : ''}
    `;

    const mailOptions = {
      from: `"Formularz DameDesign" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_RECIPIENT,
      subject: formattedSubject,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}