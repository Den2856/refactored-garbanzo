import dotenv from 'dotenv';
dotenv.config();

import express, {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler
} from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import chargersRouter from './routes/charger';
import usersRouter from './routes/users'
import evRoutes from './routes/ev'
import authRouter from './routes/auth'
import notificationRouter from './routes/notification'

import nodemailer from 'nodemailer';
import { buildApprovalHtml } from './templates/emailTemplate';

const app = express();
const CLIENT_URL  = process.env.CLIENT_URL  ?? 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4001';

// 1) JSON‐парсер
app.use(express.json());

// 2) Cookie‐парсер
app.use(cookieParser());

// 3) CORS
const RAW_CLIENTS = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const norm = origin.replace(/\/$/, '');
    let ok = RAW_CLIENTS.includes(norm);
    if (!ok) {
      try { ok = /\.vercel\.app$/.test(new URL(origin).hostname); } catch {}
    }
    return ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 0) Раздача статики из public
app.use('/static/email-icons', express.static(path.join(__dirname, '../public/email-icons'))
)

// 4) Пинг-запрос
app.get('/', (_req, res) => {
  res.send('✅ API is running');
});

// 5) Роуты по зарядкам
app.use('/api/chargers', chargersRouter);
app.use('/api/evs', evRoutes)
app.use('/api/auth', authRouter)

app.use('/api/users', usersRouter)

app.use('/api/notifications', notificationRouter)

// 6) Настройка nodemailer
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  }
});

// 7) Обработчик отправки e-mail
const sendEmail: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  if (!firstName || !lastName || !email || !message) {
    res.status(400).json({ error: 'Please fill all fields' });
    return;
  }

  try {
    await transporter.sendMail({
      from:    process.env.FROM_EMAIL,
      to:      process.env.TO_EMAIL,
      subject: `New message from ${firstName} ${lastName}`,
      replyTo: email,
      html: `
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `
    });
    res.json({ success: true });

    setTimeout(async () => {
      try {
        const html = buildApprovalHtml(
          firstName,
          lastName,
          email,
          message,
          BACKEND_URL
        );
        await transporter.sendMail({
          from:    process.env.FROM_EMAIL,
          to:      email,
          subject: 'Ваш запрос получен и одобрен',
          html,
          attachments: [
            {
              filename: 'logo.svg',
              path: path.join(__dirname, '../public/email-icons/logo.png'),
              cid: 'logo@cid'
            },
            {
              filename: 'blue-check.png',
              path: path.join(__dirname, '../public/email-icons/blue-check.png'),
              cid: 'check@cid'
            },
            {
              filename: 'google-play.png',
              path: path.join(__dirname, '../public/email-icons/google-play.png'),
              cid: 'gp@cid',
            },
            /*
            {
              filename: 'app-store.png',
              path: path.join(__dirname, '../public/email-icons/app-store.png'),
              cid: 'as@cid',
            },
            */
            {
              filename: 'facebook.png',
              path: path.join(__dirname, '../public/email-icons/facebook.png'),
              cid: 'fb@cid',
            },
            {
              filename: 'linkedin.png',
              path: path.join(__dirname, '../public/email-icons/linkedin.png'),
              cid: 'li@cid',
            },
            {
              filename: 'instagram.png',
              path: path.join(__dirname, '../public/email-icons/instagram.png'),
              cid: 'ig@cid',
            },
          ]
        });
      } catch (err) {
        console.error('Ошибка отправки отложенного письма пользователю:', err);
      }
    }, 1 * 60 * 1000);

  } catch (err) {
    console.error('SMTP Error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

app.post('/api/send-email', sendEmail);

// 8) Глобальный error-handler
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Server Error' });
  }
);

// 9) Подключение к Mongo и запуск сервера
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    const port = process.env.PORT ?? 4001;
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
