const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//View
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) =>{
   const output = `
   <p>Você recebeu uma mensagem!</p>
   <h3> Detalhes:</h3>
    <ul>
        <li>Nome: ${req.body.name}</li>
        <li>Empresa: ${req.body.company}</li>
        <li>E-mail: ${req.body.email}</li>
        <li>Telefone: ${req.body.phone}</li>        
    </ul>
    <h3>Mensagem: </h3>
    <p>${req.body.message}</p>
   `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false, // true for 465, false for other ports        
        auth: {
        user: '', // usuario / email
        pass: '', // password
        },
        tls: {
            rejectUnauthorized:false
        }       
    });
    //send mail with defined transport object
    const info =  transporter.sendMail({
        from: '"Nome" <email@email.com>', // sender address
        to: "email@email.com", // list of receivers
        subject: "Subject", // Subject line
        text: "Olá", // plain text body
        html: output // html body
    });
    console.log("Message sent: %s", info.messageId);    
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.render('contact', {msg: 'Mensagem enviada!'});
});
app.listen(3000, () => console.log('Server started...'));
