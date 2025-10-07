// Remove 'dotenv' aqui, pois o Vercel injeta as variáveis automaticamente
const nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

// O Vercel lida com o CORS e o parsing do body por padrão na função.
// Não precisamos do express.
export default async function handler(req, res) {
    // 1. Apenas processamos requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // As variáveis de ambiente são lidas diretamente do ambiente do Vercel
        const TOKEN = process.env.MAILTRAP_TOKEN;
        const EMAIL_DESTINO = process.env.EMAIL_DESTINO;

        if (!TOKEN || !EMAIL_DESTINO) {
            return res.status(500).json({ message: 'Server configuration error: Tokens not set.' });
        }
        
        // 2. Cria o Transportador (Nodemailer)
        const contactEmail = nodemailer.createTransport(
            MailtrapTransport({
                token: TOKEN,
            })
        );
        
        // 3. Obtém os dados do formulário
        const { firstName, lastName, email, phone, message } = req.body;
        
        // 4. Cria o conteúdo do e-mail
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
        await contactEmail.sendMail(mailContent);

        // 6. Retorna sucesso
        return res.status(200).json({ code: 200, success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error("Email send error:", error);
        return res.status(500).json({ code: 500, success: false, message: "Server error: " + error.message });
    }
}