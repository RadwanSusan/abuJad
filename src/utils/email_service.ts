import nodemailer from 'nodemailer';

export async function sendVerificationOTP(
	email: string,
	otp: string,
): Promise<void> {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to: email,
		subject: 'Verification OTP',
		text: `Your verification OTP is: ${otp}`,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log('Email sent successfully');
	} catch (error) {
		console.error('Error sending email:', error);
	}
}
