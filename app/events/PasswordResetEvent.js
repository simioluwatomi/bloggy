const EventEmitter = require('node:events');
const transporter = require('../../config/mail');

class PasswordReset extends EventEmitter {

}

const passwordResetEvent = new PasswordReset();

passwordResetEvent.on('passwordResetInitiated', async function (email, link) {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_SECURITY_FROM,
            to: email,
            subject: "Password Reset Infitiated",
            text: `We received a request to initiate password reset for your account. Click the link to continue: ${link}`,
        });
    } catch (error) {
    }
})

module.exports = passwordResetEvent;
