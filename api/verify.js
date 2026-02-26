import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  if (!data || !data.hash) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN; // Set in Vercel/Netlify

  const dataCheckString = Object.keys(data)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${JSON.stringify(data[key]).replace(/^"|"$/g, '')}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', BOT_TOKEN).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  const isValid = hmac === data.hash;

  if (!isValid) {
    return res.status(403).json({ verified: false, message: 'Invalid Telegram data' });
  }

  const authDate = new Date(data.auth_date * 1000).toLocaleString();

  return res.json({
    verified: true,
    message: 'Telegram WebApp data verified ✅',
    user: data.user,
    theme: data.tgWebAppThemeParams,
    auth_date: authDate
  });
                                 }
