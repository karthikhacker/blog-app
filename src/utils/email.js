import nodemailer from 'nodemailer';

const sendMail = async options => {
    // transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    // email options
    const emailOptions = {
        from: 'Karthik sundararajan <karthik.sundararajan12@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.text,

    }
    // send mail
    await transporter.sendMail(emailOptions);
}

export default sendMail;