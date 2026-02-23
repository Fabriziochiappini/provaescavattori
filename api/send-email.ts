import type { VercelRequest, VercelResponse } from '@vercel/node';
import sgMail from '@sendgrid/mail';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, phone, message, subject, type } = req.body;

    if (!process.env.SENDGRID_API_KEY) {
        return res.status(500).json({ message: 'SendGrid API Key not configured' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const fromEmail = process.env.EMAIL_FROM || 'info@contegroup.com';
    const toEmail = process.env.EMAIL_TO || 'info@contegroup.com';

    // Subject logic based on form type
    let emailSubject = subject || `Nuovo contatto dal sito web`;
    if (type === 'assistance') {
        emailSubject = `🚨 RICHIESTA ASSISTENZA: ${name}`;
    } else if (type === 'contact') {
        emailSubject = `✉️ Messaggio dal sito: ${name}`;
    }

    const msg = {
        to: toEmail, // Dove arriva la mail (info@contegroup.com)
        from: fromEmail, // Chi la invia tecnicamente (es. noreply@ o info@, deve essere verificato su SendGrid)
        replyTo: email, // <--- LA SOLUZIONE: Cliccando rispondi, rispondi al cliente!
        subject: emailSubject,
        text: `
      Nuova richiesta dal sito web:
      
      Nome: ${name}
      Email: ${email}
      Telefono: ${phone || 'Non specificato'}
      
      Messaggio:
      ${message}
    `,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Nuova Richiesta dal Sito Web</h2>
        <p>Hai ricevuto un nuovo messaggio tramite il modulo di contatto.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Telefono:</strong> <a href="tel:${phone}">${phone || 'Non specificato'}</a></p>
        </div>

        <h3>Messaggio:</h3>
        <p style="background-color: #fff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px;">
          ${message ? message.replace(/\n/g, '<br>') : 'Nessun messaggio'}
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #6b7280;">
          Questa email è stata inviata automaticamente dal sito web di Conte Group.
          <br>
          Per rispondere al cliente, clicca semplicemente su "Rispondi" nel tuo client di posta.
        </p>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error: any) {
        console.error('SendGrid Error:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}