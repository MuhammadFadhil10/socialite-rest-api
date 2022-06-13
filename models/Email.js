import nodeMailer from 'nodemailer';

const transport = nodeMailer.createTransport({
	service: 'gmail',
	host: 'localhost',
	auth: {
		user: `${process.env.OFFICIAL_EMAIL}`,
		pass: `${process.env.OFFICIAL_EMAIL_PASSWORD}`,
	},
});

export class Email {
	static sendSignupMail(userEmail) {
		transport.sendMail({
			from: 'socialdummy.services@gmail.com',
			to: userEmail,
			subject: 'Succes create account!',
			html: `
                <h1>Welcome!</h1>
            `,
		});
	}
}
