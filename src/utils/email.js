import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (msg) => {
    try {
        await sgMail.send(msg);
        console.log('email sent')

    } catch (error) {
        console.log(error)
    }
}

export default sendMail;