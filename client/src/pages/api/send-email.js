import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { firstName, lastName, email, message } = req.body;
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Настройка транспорта
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: true, // true для 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${firstName} ${lastName}" <${email}>`,
    to: process.env.TO_EMAIL,
    subject: `Новая заявка на тест-драйв от ${firstName} ${lastName}`,
    text: message,
    html: `
      <p><strong>Имя:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Сообщение:</strong><br/>${message.replace(/\n/g,'<br/>')}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}
