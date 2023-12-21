const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE, // Fix the environment variable name
        auth: {
            user: process.env.SMPT_MAIL, // Fix the environment variable name
            pass: process.env.SMPT_PASSWORD, // Fix the environment variable name
        },
    });
    
    const mailOptions = { 
        from: process.env.SMPT_MAIL, // Fix the environment variable name
        to: options.email,
        subject: options.subject,
        text: options.text
    }; 

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
