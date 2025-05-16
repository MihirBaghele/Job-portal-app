const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../../../.env' });

// Log environment variables
console.log('Email Service Environment Variables:', {
    emailUser: process.env.EMAIL_USER || 'Not set',
    emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
});

// Create a transporter with better configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Configuration Error:', error);
        console.error('Email credentials:', {
            user: process.env.EMAIL_USER,
            pass: '***' // Mask the password
        });
    } else {
        console.log('SMTP Server is ready to take our messages');
    }
});

const sendRegistrationEmail = async (email, name) => {
    try {
        console.log('Attempting to send email to:', email);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Staffing Portal - Registration Successful',
            html: `
                <h2>Welcome ${name}!</h2>
                <p>Thank you for registering on our Staffing Portal.</p>
                <p>Your account has been successfully created and you can now start using our job portal.</p>
                <p>Best regards,<br>The Staffing Portal Team</p>
            `
        };

        console.log('Mail options:', mailOptions);
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        console.log('Response:', info.response);
        
        return true;
    } catch (error) {
        console.error('Error sending registration email:', error);
        console.error('Error details:', {
            code: error.code,
            response: error.response,
            message: error.message
        });
        return false;
    }
};

module.exports = {
    sendRegistrationEmail
};
