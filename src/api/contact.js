const nodemailer = require("nodemailer"); 

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const SMTP_HOST = process.env.MAILTRAP_SMTP_HOST;
        const SMTP_USER = process.env.MAILTRAP_SMTP_USER;
        const SMTP_PASS = process.env.MAILTRAP_SMTP_PASS; 
        const EMAIL_DESTINO = process.env.EMAIL_DESTINO; 

        if (!SMTP_USER || !SMTP_PASS || !EMAIL_DESTINO) {
            return res.status(500).json({ message: 'Server configuration error: SMTP credentials not set.' });
        }
        
     
        const contactEmail = nodemailer.createTransport({
            host: SMTP_HOST,
            port: 587, 
            auth: {
                user: SMTP_USER, 
                pass: SMTP_PASS,
            }
        });
        
        const { firstName, lastName, email, phone, message } = req.body;
        
        const mailContent = {
            from: email,
            to: EMAIL_DESTINO,
            subject: "Nova Mensagem de Portfólio - " + firstName + " " + lastName,
            html: `
                <p>Você recebeu uma nova mensagem de contato do seu portfólio.</p>
                <p>Nome: ${firstName} ${lastName}</p>
                <p>Email: ${email}</p>
                <p>Telefone: ${phone}</p>
                <p>Mensagem: ${message}</p>
            `,
        };

        await contactEmail.sendMail(mailContent);

        return res.status(200).json({ code: 200, success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error("Email send error:", error);
        return res.status(500).json({ code: 500, success: false, message: "Server error: " + error.message });
    }
}