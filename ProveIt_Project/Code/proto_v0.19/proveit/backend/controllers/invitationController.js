const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();
const sanitizeHtml = require('sanitize-html');

const HT_QA_API = "https://apiqa.hometrumpeter.com";
const INVITE_USER_LINK = HT_QA_API + "/user/invite";

const clean = (dirty) => {
    return sanitizeHtml(dirty, { // Sanitize inputs to prevent XSS attacks
        allowedTags: [],
        allowedAttributes: {}
    });
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'proveitmailer@gmail.com',
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    }
});

function sendEmail(to, subject, htmlContent) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: 'proveitmailer@gmail.com',
            to: to,
            subject: subject,
            html: htmlContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                reject(error);
            } else {
                console.log('Email sent:', info.response);
                resolve(info);
            }
        });
    });
}

exports.inviteUser = (req, res) => {
    console.log("--Posting to invite user--");
    console.log(req.body);

    // Need to send request to both links
    // INVITE_USER_LINK will generate user id and store the invite user in HT database
    // sendEmail() will send the email through ProveIT system and redirect the user back to ProveIT system.

    // Sanitization of input
    const firstName = clean(req.body.firstName);
    const lastName = clean(req.body.lastName);
    const roleName = clean(req.body.roleName);
    const propertyName = clean(req.body.propertyName);
    const encodedUserEmail = encodeURIComponent(clean(req.body.user.email)); // Ensuring the email is also sanitized before encoding

    const recipient = req.body.user.email; 
    const subject = 'Invitation to Join HomeTrumpeter';
    const htmlContent = `<!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <title>Invitation</title>
                                    <style>
                                        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
                                        .email-container {
                                            font-family: 'Montserrat', sans-serif;
                                            max-width: 600px;
                                            margin: 0 auto;
                                            background-color: #f7f7f7;
                                            padding: 20px;
                                            border-radius: 8px;
                                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                                        }
                                        .header {
                                            background-color: #194185;
                                            color: white;
                                            padding: 10px;
                                            text-align: center;
                                            border-radius: 8px 8px 0 0;
                                        }
                                        .content {
                                            padding: 20px;
                                            text-align: center;
                                        }
                                        .button {
                                            display: inline-block;
                                            padding: 10px 20px;
                                            margin-top: 20px;
                                            background-color: #194185;
                                            color: white;
                                            text-decoration: none;
                                            border-radius: 5px;
                                            transition: background-color 0.3s;
                                        }
                                        .button:hover {
                                            background-color: #163466;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="email-container">
                                        <div class="header">
                                            <h1>You're Invited!</h1>
                                        </div>
                                        <div class="content">
                                            <p>Hello ${firstName} ${lastName},</p>
                                            <p>You have been invited to join as a ${roleName} for ${propertyName} at HomeTrumpeter.</p>
                                            <a href="${process.env.FRONT_URL}/signup/invited?email=${encodedUserEmail}&role=${roleName}" class="button">Join Now</a>
                                        </div>
                                    </div>
                                </body>
                                </html>`;



    delete req.body.propertyName;

    //const sendEmailPromise = sendEmail(recipient, subject, htmlContent);
    const axiosPostPromise = axios.post(INVITE_USER_LINK, req.body, {
        headers: {
            'xck': process.env.API_TOKEN,
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization,
        }
    });

    Promise.all([/*sendEmailPromise,*/ axiosPostPromise])
        .then(([/*emailResponse,*/ axiosResponse]) => {
            //console.log('Email response:', emailResponse);
            console.log('Axios response:', axiosResponse.data);
            res.json({ message: 'Invite sent successfully', data: axiosResponse.data });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error sending invite' });
        });
}