// api/contact.js

const nodemailer = require("nodemailer");

export default async function handler(req, res) {
    // Define cabeçalhos CORS para garantir a comunicação segura
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 1. TRATAMENTO DO PRÉ-VOO (Preflight Request): CORS OPTIONS
    if (req.method === 'OPTIONS') {
        // Responde com sucesso (Status 200) para o pré-voo, permitindo a requisição POST
        return res.status(200).end();
    }

    // 2. CHECAGEM CRÍTICA: Só permite o método POST
    if (req.method !== 'POST') {
        // Retorna 405 (Method Not Allowed) para qualquer outra requisição (GET, etc.)
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Variáveis de Ambiente para autenticação SMTP (Mailtrap)
        const SMTP_HOST = process.env.MAILTRAP_SMTP_HOST;
        const SMTP_USER = process.env.MAILTRAP_SMTP_USER; 
        const SMTP_PASS = process.env.MAILTRAP_SMTP_PASS; 
        const EMAIL_DESTINO = process.env.EMAIL_DESTINO; 

        // 3. Cria o Transportador usando SMTP Padrão
        const contactEmail = nodemailer.createTransport({
            host: SMTP_HOST,
            port: 587, 
            auth: {
                user: SMTP_USER, 
                pass: SMTP_PASS,
            }
        });
        
        // 4. Obtém os dados do formulário
        const { firstName, lastName, email, phone, message } = req.body;
        
        // 5. Conteúdo do e-mail
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

        // 6. Envia o e-mail
        await contactEmail.sendMail(mailContent);

        // 7. Retorno de sucesso
        return res.status(200).json({ code: 200, success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error("Email send error:", error);
        // 8. Retorno de erro interno do servidor
        return res.status(500).json({ code: 500, success: false, message: "Server error: Failed to send email." });
    }
}