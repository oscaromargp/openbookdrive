/* global process */
import Imap from 'imap';
import nodemailer from 'nodemailer';

const GMAIL_USER = 'oscaromargp@gmail.com';
const GMAIL_APP_PASSWORD = 'xwiv fpmz dpeu ozzs';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

const processedIds = new Set();

const imap = new Imap({
  user: GMAIL_USER,
  password: GMAIL_APP_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { 
    rejectUnauthorized: false,
    servername: 'imap.gmail.com'
  }
});

function buildHtmlReply(fromEmail, subject) {
  const cleanSubject = subject?.replace(/^(Re:|Fwd?:)\s*/i, '') || 'Sin asunto';
  const now = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #1a1a2e; color: #e0e0e0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #16213e 0%, #0f3460 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #e94560, #ff6b6b); padding: 40px; text-align: center; }
    .header h1 { color: #fff; font-size: 32px; margin: 0; }
    .content { padding: 40px; }
    .emoji { font-size: 80px; text-align: center; margin: 20px 0; }
    .message { font-size: 18px; line-height: 1.8; margin: 30px 0; text-align: center; }
    .thanks { font-size: 28px; color: #f59e0b; font-weight: bold; text-align: center; margin: 40px 0; }
    .info-box { background: rgba(233, 69, 96, 0.1); border: 1px solid #e94560; border-radius: 12px; padding: 20px; margin: 30px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #f59e0b; font-weight: 600; }
    .info-value { color: #e0e0e0; }
    .signature { margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; }
    .signature p { color: #888; font-size: 14px; margin: 5px 0; }
    .signature a { color: #e94560; text-decoration: none; }
    .footer { background: #0a0a1a; padding: 20px; text-align: center; font-size: 12px; color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>OpenBookDrive 📚</h1>
    </div>
    <div class="content">
      <div class="emoji">🙏</div>
      <p class="thanks">¡Muchas gracias!</p>
      <p class="message">
        He recibido tu mensaje correctamente.<br>
        Estaré revisándolo y te responderé lo antes posible.
      </p>
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">📧 Asunto:</span>
          <span class="info-value">${cleanSubject}</span>
        </div>
        <div class="info-row">
          <span class="info-label">🕐 Hora:</span>
          <span class="info-value">${now}</span>
        </div>
      </div>
      <div class="signature">
        <p><strong>Oscar Omar Gómez Peña</strong></p>
        <p><a href="https://github.com/oscaromargp">GitHub</a> · <a href="https://oscaromargp.github.io">Portafolio</a></p>
      </div>
    </div>
    <div class="footer">
      <p>Mensaje automático de OpenBookDrive · ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>`;
}

async function sendAutoReply(to, subject) {
  try {
    await transporter.sendMail({
      from: `"Oscar OpenBookDrive 📚" <${GMAIL_USER}>`,
      to,
      subject: `Re: ${subject}`,
      html: buildHtmlReply(to, subject)
    });
    console.log(`✅ Respuesta enviada a: ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando a ${to}: ${error.message}`);
    return false;
  }
}

async function getUnreadEmails() {
  return new Promise((resolve, reject) => {
    imap.openBox('INBOX', true, (err, box) => {
      if (err) return reject(err);
      
      const total = box.messages.total;
      if (total === 0) return resolve([]);
      
      const range = `${Math.max(1, total - 20)}:${total}`;
      const f = imap.fetch(range, {
        bodies: 'HEADER.FIELDS (FROM SUBJECT MESSAGE-ID)',
        markSeen: false
      });
      
      const emails = [];
      
      f.on('message', (msg) => {
        const email = {};
        msg.on('headers', (h) => { email.headers = h; });
        msg.on('end', () => emails.push(email));
      });
      
      f.once('error', reject);
      f.once('end', () => resolve(emails));
    });
  });
}

async function checkEmails() {
  const timestamp = new Date().toLocaleTimeString('es-MX');
  console.log(`\n⏰ [${timestamp}] Verificando correos...`);
  
  try {
    const emails = await getUnreadEmails();
    console.log(`📬 ${emails.length} correo(s) encontrado(s)`);
    
    for (const email of emails) {
      const headers = email.headers || {};
      const messageId = headers['message-id']?.[0] || '';
      const from = headers.from?.[0] || '';
      const subject = headers.subject?.[0] || 'Sin asunto';
      
      const emailMatch = from.match(/<(.+)>/);
      const senderEmail = emailMatch ? emailMatch[1] : from.replace(/"/g, '');
      
      if (senderEmail.toLowerCase().includes(GMAIL_USER.toLowerCase())) {
        continue;
      }
      
      if (processedIds.has(messageId)) continue;
      processedIds.add(messageId);
      
      if (processedIds.size > 1000) {
        processedIds.delete(processedIds.values().next().value);
      }
      
      console.log(`📩 De: ${senderEmail}`);
      console.log(`   Asunto: ${subject}`);
      await sendAutoReply(senderEmail, subject);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║     OpenBookDrive Auto-Responder Gmail             ║
║     Autor: Oscar Omar Gómez Peña                   ║
╚══════════════════════════════════════════════════════╝
  `);
  
  console.log(`📧 Cuenta: ${GMAIL_USER}`);
  console.log(`🔄 Revisando cada 5 minutos\n`);
  
  imap.once('ready', () => {
    console.log('✅ Conectado a Gmail');
    checkEmails();
    setInterval(checkEmails, 5 * 60 * 1000);
  });
  
  imap.once('error', (err) => {
    console.error(`❌ Error IMAP: ${err.message}`);
  });
  
  imap.connect();
}

process.on('SIGINT', () => {
  console.log('\n👋 Cerrando...');
  imap.end();
  process.exit(0);
});

main().catch(console.error);