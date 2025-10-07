require('dotenv').config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
// Você pode manter o Mailtrap ou mudar para um provedor real como Gmail/SendGrid
const { MailtrapTransport } = require("mailtrap"); 

const app = express();
const router = express.Router();
const PORT = 5000; // Porta de comunicação do frontend (Contact.js)

// --- Configuração do Servidor ---
app.use(cors()); // Permite que o frontend (localhost:3000) converse com o backend
app.use(express.json()); // Permite ler o JSON enviado pelo formulário

// --- Configuração do Nodemailer/Mailtrap ---
const TOKEN = process.env.MAILTRAP_TOKEN; 
const EMAIL_DESTINO = process.env.EMAIL_DESTINO;

const contactEmail = nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

// --- Rota de Contato ---
router.post("/contact", (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  
  // Corpo do email que será enviado para você
  const mailContent = {
    from: email, // O email da pessoa que preencheu o formulário
    to: EMAIL_DESTINO, // SEU EMAIL REAL AQUI
    subject: "Nova Mensagem de Portfólio - " + firstName + " " + lastName,
    html: `
      <p>Você recebeu uma nova mensagem de contato do seu portfólio.</p>
      <p>Nome: ${firstName} ${lastName}</p>
      <p>Email: ${email}</p>
      <p>Telefone: ${phone}</p>
      <p>Mensagem: ${message}</p>
    `,
  };

  contactEmail.sendMail(mailContent, (error) => {
    if (error) {
      res.json({ code: 500, success: false, message: "Server error: " + error.message });
    } else {
      res.json({ code: 200, success: true, message: "Message sent successfully" });
    }
  });
});

app.use("/", router);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));