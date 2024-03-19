import { NextRequest } from 'next/server';
import dbConnect from '../../../utils/mongodb';
import CompanyModel from '../../../models/companies';
import { sendVerificationOTP } from '../../../utils/email_service';

export async function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
}

export async function POST(req: NextRequest) {
	await dbConnect();
	try {
		const body = await req.json();
		const { email } = body;

		const company = await CompanyModel.findOne({ Company_email: email });

		if (!company) {
			return new Response(JSON.stringify({ error: 'Company not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const otp = generateOTP();
		await sendVerificationOTP(email, otp);

		company.Company_otp = otp;
		await company.save();

		return new Response(
			JSON.stringify({ message: 'OTP sent successfully' }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		);
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

function generateOTP(): string {
	const digits = '0123456789';
	let otp = '';
	for (let i = 0; i < 4; i++) {
		otp += digits[Math.floor(Math.random() * 10)];
	}
	return otp;
}
