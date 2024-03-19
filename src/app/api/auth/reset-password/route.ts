import { NextRequest } from 'next/server';
import dbConnect from '../../../../utils/mongodb';
import CompanyModel from '../../../../models/companies';

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
		const { email, password } = body;

		const company = await CompanyModel.findOne({ Company_email: email });
		if (!company) {
			return new Response(JSON.stringify({ error: 'Company not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		company.Company_password = password;
		await company.save();

		return new Response(
			JSON.stringify({ message: 'Password reset successfully' }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
