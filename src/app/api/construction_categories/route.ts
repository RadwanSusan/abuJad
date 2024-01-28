// app/api/construction_categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '../../../utils/mongodb';
import Construction_categoriesModel from '../../../models/construction_categories';
import ConstructionModel from '../../../models/constructions';

export async function GET(req: NextRequest) {
	await dbConnect();
	const categoryId = req.nextUrl.searchParams.get('categoryId');
	try {
		if (categoryId) {
			const category = await Construction_categoriesModel.findOne({
				_id: new ObjectId(categoryId),
			});
			if (!category) {
				return new Response(null, { status: 404 });
			}
			return NextResponse.json(category);
		} else {
			const categories = await Construction_categoriesModel.find({});
			return NextResponse.json(categories);
		}
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	await dbConnect();
	try {
		const body = await req.json();
		const category = new Construction_categoriesModel(body);
		await category.save();

		await ConstructionModel.findByIdAndUpdate(
			body.Construction_id,
			{ $push: { Construction_categories: category._id } },
			{ new: true, useFindAndModify: false },
		);

		return NextResponse.json(category);
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 400 });
	}
}

export async function PUT(req: NextRequest) {
	await dbConnect();
	const categoryId = req.nextUrl.searchParams.get('categoryId');
	try {
		const body = await req.json();
		const updatedCategory = await Construction_categoriesModel.updateOne(
			{ _id: new ObjectId(categoryId) },
			body,
		);
		if (!updatedCategory) {
			return new Response(null, { status: 404 });
		}
		return NextResponse.json(updatedCategory);
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	await dbConnect();
	const categoryId = req.nextUrl.searchParams.get('categoryId');
	const deleteAll = req.nextUrl.searchParams.get('deleteAll');

	try {
		let deleteResult;
		if (deleteAll === 'true') {
			deleteResult = await Construction_categoriesModel.deleteMany({});
		} else if (categoryId) {
			deleteResult = await Construction_categoriesModel.deleteOne({
				_id: new ObjectId(categoryId),
			});
		} else {
			return new Response(null, { status: 400 });
		}

		if (deleteResult.deletedCount === 0) {
			return new Response(null, { status: 404 });
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}
