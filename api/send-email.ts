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

    // Send email to Conte Group (with Reply-To set to customer)
    const msgToAdmin = {
        to: 'info@contegroup.com', // Always to Conte Group
        from: fromEmail, 
        replyTo: email, 
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

    // Send confirmation email to Customer
    const msgToCustomer = {
        to: email, // To the customer
        from: fromEmail,
        subject: 'Abbiamo ricevuto la tua richiesta - Conte Group',
        text: `
      Gentile ${name},
      
      Abbiamo ricevuto la tua richiesta e ti ringraziamo per averci contattato.
      Un nostro operatore prenderà in carico la tua richiesta e ti risponderà il prima possibile.
      
      Riepilogo della tua richiesta:
      ${message}
      
      Cordiali saluti,
      Team Conte Group
      
      Tel: +39 0823 982162
      Email: info@contegroup.com
      Sito: www.contegroup.com
    `,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
           <h1 style="color: #ea580c; font-style: italic;">CONTE GROUP</h1>
        </div>

        <p>Gentile <strong>${name}</strong>,</p>
        
        <p>Abbiamo ricevuto la tua richiesta e ti ringraziamo per averci contattato.</p>
        
        <p>Un nostro operatore ha già preso in carico la tua segnalazione e ti risponderà il prima possibile.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Il tuo messaggio:</p>
          <p style="margin-top: 5px; font-style: italic;">"${message || ''}"</p>
        </div>

        <p>Se hai urgenza, puoi contattarci direttamente ai seguenti recapiti:</p>
        
        <div style="display: flex; gap: 20px; margin-top: 20px;">
            <a href="tel:+390823982162" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">📞 Chiama 0823 982162</a>
            <a clicktracking="off" href="https://wa.me/393518349368" style="background-color: #25D366; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">💬 WhatsApp</a>
        </div>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;" />
        
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
          Conte Group S.r.l.<br>
          Via SP330, 24, 81016 Pietravairano (CE)<br>
          <a href="https://www.contegroup.com" style="color: #ea580c;">www.contegroup.com</a>
        </p>
      </div>
    `,
    };

    try {
        // Send both emails in parallel
        await Promise.all([
            sgMail.send(msgToAdmin),
            sgMail.send(msgToCustomer)
        ]);
        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error: any) {
        console.error('SendGrid Error:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}