import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'fallback-secret-for-captcha';

export interface CaptchaData {
  question: string;
  token: string;
}

export function generateCaptcha(): CaptchaData {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const chars = ['+', '-', '*'];
  const char = chars[Math.floor(Math.random() * chars.length)];
  
  let answer: number;
  switch (char) {
    case '+': answer = num1 + num2; break;
    case '-': answer = num1 - num2; break;
    case '*': answer = num1 * num2; break;
    default: answer = num1 + num2;
  }

  const question = `${num1} ${char} ${num2}`;
  
  // Create a signed token: answer|expires|signature
  const expires = Date.now() + 1000 * 60 * 5; // 5 minutes expiry
  const dataToSign = `${answer}|${expires}`;
  const signature = crypto.createHmac('sha256', SECRET).update(dataToSign).digest('hex');
  const token = Buffer.from(`${dataToSign}|${signature}`).toString('base64');

  return { question, token };
}

export function verifyCaptcha(token: string, userAnswer: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [answer, expires, signature] = decoded.split('|');
    
    if (Date.now() > parseInt(expires)) return false;
    
    const dataToVerify = `${answer}|${expires}`;
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(dataToVerify).digest('hex');
    
    if (signature !== expectedSignature) return false;
    
    return userAnswer === answer;
  } catch (e) {
    return false;
  }
}
