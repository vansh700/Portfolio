import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { prisma } from '../utils/prisma';

// Rate limiting map: ip -> { count, windowStart }
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) return true;
  record.count++;
  return false;
}

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not your regular password)
    },
  });
}

export async function sendContactMessage(req: Request, res: Response) {
  try {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    if (isRateLimited(ip)) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    // Save to DB
    try {
      await prisma.contactMessage.create({ data: { name, email, message } });
    } catch (dbErr) {
      console.error('DB save failed (non-critical):', dbErr);
    }

    // Send email
    const toEmail = process.env.GMAIL_USER;
    if (!toEmail || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Email not configured — skipping send. Set GMAIL_USER and GMAIL_APP_PASSWORD.');
      return res.json({ message: 'Message received! (Email delivery not configured)' });
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      replyTo: `"${name}" <${email}>`,
      subject: `📬 Portfolio Contact from ${name}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Portfolio Contact</h1>
          </div>
          <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 80px;"><strong>Name</strong></td>
                <td style="padding: 8px 0; color: #1e293b;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Email</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p style="color: #64748b; font-size: 13px; margin: 0 0 8px;">Message</p>
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; line-height: 1.7; white-space: pre-wrap;">${message}</div>
            <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
    });

    // Send auto-reply to sender
    await transporter.sendMail({
      from: `"Vansh Soni" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}! 👋`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Message Received! ✅</h1>
          </div>
          <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
            <p style="color: #334155; line-height: 1.7;">Hey <strong>${name}</strong>,</p>
            <p style="color: #334155; line-height: 1.7;">Thanks for getting in touch! I've received your message and will get back to you within 24 hours.</p>
            <p style="color: #334155; line-height: 1.7;">Here's what you sent:</p>
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; color: #64748b; font-style: italic; white-space: pre-wrap;">"${message}"</div>
            <p style="color: #334155; margin-top: 24px;">Cheers,<br/><strong>Vansh Soni</strong></p>
          </div>
        </div>
      `,
    });

    return res.json({ message: 'Message sent successfully! I\'ll get back to you soon.' });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
}
