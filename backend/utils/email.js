const sendEmail = async (options) => {
    // 1) Create a transporter
    // const transporter = nodemailer.createTransport({ ... });

    // 2) Define the email options
    const mailOptions = {
        from: 'Groovify <hello@groovify.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    };

    // 3) Actually send the email
    // await transporter.sendMail(mailOptions);

    console.log(`[MOCK EMAIL] To: ${options.email} | Subject: ${options.subject} | Message: ${options.message}`);
};

module.exports = sendEmail;
