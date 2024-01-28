// app/api/quotations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/mongodb';
import QuotationModel from '../../../models/quotations';
import CompanyModel from '../../../models/companies';

export async function GET(req: NextRequest) {
	await dbConnect();
	const quotationId = req.nextUrl.searchParams.get('quotationId');
	try {
		if (quotationId) {
			const quotation = await QuotationModel.findById(quotationId);
			if (!quotation) {
				return new NextResponse(null, { status: 404 });
			}
			return NextResponse.json(quotation);
		} else {
			const quotations = await QuotationModel.find({});
			return NextResponse.json(quotations);
		}
	} catch (error) {
		return new NextResponse(JSON.stringify(error), { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	await dbConnect();
	const body = await req.json();
	const { companyId, ...quotationData } = body;

	const company = await CompanyModel.findById(companyId);
	if (!company || company.Company_type !== 'constructer') {
		return new NextResponse(
			JSON.stringify({
				message: 'Invalid company type or company does not exist',
			}),
			{ status: 400 },
		);
	}

	const quotation = new QuotationModel({
		...quotationData,
		companyId: company._id,
	});
	try {
		await quotation.save();
		return NextResponse.json(quotation);
	} catch (error) {
		return new NextResponse(JSON.stringify({ message: error.message }), {
			status: 500,
		});
	}
}

export async function PUT(req: NextRequest) {
	await dbConnect();
	const _id = req.nextUrl.searchParams.get('_id');
	if (!_id) {
		return new NextResponse(null, {
			status: 400,
			statusText: 'Quotation ID is required',
		});
	}
	try {
		const body = await req.json();
		const updatedQuotation = await QuotationModel.findByIdAndUpdate(
			_id,
			body,
			{ new: true },
		);
		if (!updatedQuotation) {
			return new NextResponse(null, { status: 404 });
		}
		return NextResponse.json(updatedQuotation);
	} catch (error) {
		return new NextResponse(JSON.stringify(error), { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	await dbConnect();
	const deleteAll = req.nextUrl.searchParams.get('deleteAll');

	try {
		if (deleteAll === 'true') {
			// Delete all quotations
			const deleteResult = await QuotationModel.deleteMany({});
			if (deleteResult.deletedCount === 0) {
				return new NextResponse(null, { status: 404 });
			}
		} else {
			const _id = req.nextUrl.searchParams.get('_id');
			if (!_id) {
				return new NextResponse(null, {
					status: 400,
					statusText: 'Quotation ID is required',
				});
			}
			const deleteResult = await QuotationModel.findByIdAndDelete(_id);
			if (!deleteResult) {
				return new NextResponse(null, { status: 404 });
			}
		}
		return new NextResponse(null, { status: 204 });
	} catch (error) {
		return new NextResponse(JSON.stringify(error), { status: 500 });
	}
}
