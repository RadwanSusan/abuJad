// app/api/companies/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../utils/mongodb'; // Adjust the import path as necessary
import CompanyModel from '../../../models/companies'; // Adjust the import path as necessary

export async function GET(req: NextRequest) {
	await dbConnect();
	const companyId = req.nextUrl.searchParams.get('companyId'); // Correctly use the get method
	try {
		if (companyId) {
			// If a companyId is provided, fetch a single company
			const company = await CompanyModel.findOne({ Company_id: companyId });
			if (!company) {
				return new Response(null, { status: 404 });
			}
			return NextResponse.json(company);
		} else {
			// If no companyId is provided, fetch all companies
			const companies = await CompanyModel.find({});
			return NextResponse.json(companies);
		}
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	await dbConnect();
	try {
		const body = await req.json();
		const company = new CompanyModel(body);
		await company.save();
		return NextResponse.json(company);
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}

export async function DELETE(req: NextRequest) {
	await dbConnect();
	const companyId = req.nextUrl.searchParams.get('companyId');

	try {
		let deleteResult;
		if (companyId) {
			// Delete a single document by Company_id
			deleteResult = await CompanyModel.deleteOne({ Company_id: companyId });
		} else {
			// Delete all documents
			const deleteAll = req.nextUrl.searchParams.get('deleteAll'); // Correctly use the get method
			if (deleteAll === 'true') {
				deleteResult = await CompanyModel.deleteMany({});
			} else {
				return new Response(null, { status: 400 });
			}
		}

		// Check if the delete operation didn't delete any documents
		if (deleteResult.deletedCount === 0) {
			return new Response(null, { status: 404 });
		}

		// Respond with no content but a success status code
		return new Response(null, { status: 204 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	await dbConnect();
	const companyId = req.nextUrl.searchParams.get('companyId'); // Correctly use the get method
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
