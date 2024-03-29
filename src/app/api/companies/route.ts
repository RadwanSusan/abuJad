import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../utils/mongodb';
import CompanyModel from '../../../models/companies';

// export async function GET(req: NextRequest) {
// 	await dbConnect();
// 	const companyId = req.nextUrl.searchParams.get('companyId');
// 	try {
// 		if (companyId) {
// 			const company = await CompanyModel.findOne({ Company_id: companyId });
// 			if (!company) {
// 				return new Response(null, { status: 404 });
// 			}
// 			return NextResponse.json(company);
// 		} else {
// 			const companies = await CompanyModel.find({});
// 			return NextResponse.json(companies);
// 		}
// 	} catch (error) {
// 		return new Response(JSON.stringify(error), { status: 500 });
// 	}
// }

export async function POST(req: NextRequest) {
	await dbConnect();
	try {
		const body = await req.json();
		if (body.action === 'login') {
			const { Company_email, Company_password, Company_type } = body;
			const company = await CompanyModel.findOne({
				Company_email,
				Company_password,
				Company_type,
			});
			if (!company) {
				return new Response(
					JSON.stringify({ error: 'Invalid credentials' }),
					{
						status: 401,
						headers: { 'Content-Type': 'application/json' },
					},
				);
			}
			return NextResponse.json(company);
		} else if (body.action === 'register') {
			body.Company_id = Array.from({ length: 6 }, () =>
				Math.random().toString(36).slice(2),
			).join('');
			const company = new CompanyModel(body);
			await company.save();
			return NextResponse.json(company);
		} else if (body.action === 'verifyPassword') {
			const { companyId, password } = body;
			const company = await CompanyModel.findOne({ Company_id: companyId });
			if (company && company.Company_password === password) {
				return NextResponse.json({ isValid: true });
			} else {
				return new Response(JSON.stringify({ error: 'Invalid password' }), {
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				});
			}
		}
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function PUT(req: NextRequest) {
	await dbConnect();
	const companyId = req.nextUrl.searchParams.get('companyId');
	try {
		const body = await req.json();
		const updatedCompany = await CompanyModel.updateOne(
			{ Company_id: companyId },
			body,
		);
		if (!updatedCompany) {
			return new Response(null, { status: 404 });
		}
		return NextResponse.json(updatedCompany);
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	await dbConnect();
	const companyId = req.nextUrl.searchParams.get('companyId');

	try {
		let deleteResult;
		if (companyId) {
			deleteResult = await CompanyModel.deleteOne({ Company_id: companyId });
		} else {
			const deleteAll = req.nextUrl.searchParams.get('deleteAll');
			if (deleteAll === 'true') {
				deleteResult = await CompanyModel.deleteMany({});
			} else {
				return new Response(null, { status: 400 });
			}
		}
		if (deleteResult.deletedCount === 0) {
			return new Response(null, { status: 404 });
		}
		return new Response(null, { status: 204 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function GET(req: NextRequest) {
	await dbConnect();
	const companyId = req.nextUrl.searchParams.get('companyId');
	const companyType = req.nextUrl.searchParams.get('type');

	try {
		if (companyId) {
			const company = await CompanyModel.findOne({ Company_id: companyId });
			if (!company) {
				return new Response(null, { status: 404 });
			}
			return NextResponse.json(company);
		} else if (companyType) {
			const companies = await CompanyModel.find({
				Company_type: companyType,
			});
			return NextResponse.json(companies);
		} else {
			const companies = await CompanyModel.find({});
			return NextResponse.json(companies);
		}
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}


}
