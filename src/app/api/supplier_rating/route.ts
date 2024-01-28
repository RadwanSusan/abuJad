import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../utils/mongodb';
import SupplierRatingModel from '../../../models/supplier_rating';
import CompanyModel from '../../../models/companies';

async function updateCompanyAverageRating(companyId: Types.ObjectId) {
	// Calculate the new average rating
	const aggregation = await SupplierRatingModel.aggregate([
		{ $match: { companyId: companyId } },
		{ $group: { _id: '$companyId', avgRating: { $avg: '$rating' } } },
	]);

	if (aggregation.length > 0) {
		let { avgRating } = aggregation[0];
		// Round the average rating to one decimal place and convert it back to a number
		avgRating = +avgRating.toFixed(1);
		// Update the company's average rating
		await CompanyModel.findByIdAndUpdate(companyId, {
			Company_rating: avgRating,
		});
	} else {
		// If there are no ratings, you might want to reset the average rating
		await CompanyModel.findByIdAndUpdate(companyId, { Company_rating: 0 });
	}
}

export async function GET(req: NextRequest) {
	await dbConnect();
	const companyId = req.nextUrl.searchParams.get('companyId');
	try {
		const ratings = await SupplierRatingModel.find({ companyId }).populate(
			'companyId',
			'Company_name',
		);
		return NextResponse.json(ratings);
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}

export async function POST(req: NextRequest) {
	await dbConnect();
	try {
		const { companyId, rating, comment } = await req.json();
		const company = await CompanyModel.findById(companyId);
		if (!company || company.Company_type !== 'supplier') {
			return new Response(
				JSON.stringify({
					error: 'Company is not a supplier or does not exist',
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);
		}
		const newRating = new SupplierRatingModel({ companyId, rating, comment });
		await newRating.save();
		await updateCompanyAverageRating(newRating.companyId);
		return NextResponse.json(newRating);
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}

export async function PUT(req: NextRequest) {
	await dbConnect();
	const _id = req.nextUrl.searchParams.get('_id');
	try {
		const { rating, comment } = await req.json();
		// Ensure { new: true } to get the updated document back
		const updatedRating = await SupplierRatingModel.findByIdAndUpdate(
			_id,
			{ rating, comment },
			{ new: true },
		);
		if (!updatedRating) {
			return new Response(null, { status: 404 });
		}
		// Use the companyId from the updated rating document
		await updateCompanyAverageRating(updatedRating.companyId);
		return NextResponse.json(updatedRating);
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}

export async function DELETE(req: NextRequest) {
	await dbConnect();
	const deleteAll = req.nextUrl.searchParams.get('deleteAll');

	try {
		let deleteResult;
		if (deleteAll === 'true') {
			// Delete all ratings
			deleteResult = await SupplierRatingModel.deleteMany({});
			// Optionally, update company average rating for all companies if needed
		} else {
			const _id = req.nextUrl.searchParams.get('_id');
			if (!_id) {
				return new Response(null, {
					status: 400,
					statusText: '_id is required',
				});
			}
			deleteResult = await SupplierRatingModel.findByIdAndDelete(_id);
			if (!deleteResult) {
				return new Response(null, { status: 404 });
			}
			await updateCompanyAverageRating(deleteResult.companyId); // Recalculate the average rating
		}

		// Check if any documents were deleted
		if (deleteResult.deletedCount === 0) {
			return new Response(null, { status: 404 });
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}
