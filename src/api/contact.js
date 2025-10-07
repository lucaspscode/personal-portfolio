// api/contact.js

const nodemailer = require("nodemailer");

export default async function handler(req, res) {
    // 1. CHECAGEM CRÍTICA: Só permite o método POST
    if (req.method !== 'POST') {
        // Retorna 405 (Method Not Allowed) para qualquer outra requisição (GET, OPTIONS, etc.)
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Variáveis de Ambiente para autenticação SMTP (Mailtrap)
        const SMTP_HOST = process.env.MAILTRAP_SMTP_HOST;
        const SMTP_USER = process.env.MAILTRAP_SMTP_USER; 
        const SMTP_PASS = process.env.MAILTRAP_SMTP_PASS; 
        const EMAIL_DESTINO = process.env.EMAIL_DESTINO; 

        // 2. Cria o Transportador usando SMTP Padrão
        const contactEmail = nodemailer.createTransport({
            host: SMTP_HOST,
            port: 587, // Porta padrão
            auth: {
                user: SMTP_USER, 
                pass: SMTP_PASS,
            }
        });
        
        // 3. Obtém os dados do formulário
        const { firstName, lastName, email, phone, message } = req.body;
        
        // 4. Conteúdo do e-mail
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

        // 5. Envia o e-mail
        // O Nodemailer agora é assíncrono, então usamos await
        await contactEmail.sendMail(mailContent);

        // 6. Retorno de sucesso
        return res.status(200).json({ code: 200, success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error("Email send error:", error);
        // 7. Retorno de erro interno do servidor
        return res.status(500).json({ code: 500, success: false, message: "Server error: Failed to send email." });
    }
}