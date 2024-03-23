// // app/api/constructions/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import dbConnect from '../../../utils/mongodb'; // Adjust the import path as necessary
// import ConstructionModel from '../../../models/constructions'; // Adjust the import path as necessary

// export async function GET(req: NextRequest) {
// 	await dbConnect();
// 	const constructionId = req.nextUrl.searchParams.get('constructionId');
// 	try {
// 		if (constructionId) {
// 			const construction = await ConstructionModel.findOne({
// 				Construction_id: constructionId,
// 			});
// 			if (!construction) {
// 				return new Response(null, { status: 404 });
// 			}
// 			return NextResponse.json(construction);
// 		} else {
// 			const constructions = await ConstructionModel.find({});
// 			return NextResponse.json(constructions);
// 		}
// 	} catch (error) {
// 		return new Response(JSON.stringify(error), { status: 500 });
// 	}
// }

// export async function POST(req: NextRequest) {
// 	await dbConnect();
// 	try {
// 		const body = await req.json();
// 		const construction = new ConstructionModel(body);
// 		await construction.save();
// 		return NextResponse.json(construction);
// 	} catch (error) {
// 		return new Response(JSON.stringify(error), {
// 			status: 400,
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 		});
// 	}
// }

// export async function PUT(req: NextRequest) {
// 	await dbConnect();
// 	const constructionId = req.nextUrl.searchParams.get('constructionId');
// 	try {
// 		const body = await req.json();
// 		const updatedConstruction = await ConstructionModel.updateOne(
// 			{ Construction_id: constructionId },
// 			body,
// 		);
// 		if (!updatedConstruction) {
// 			return new Response(null, { status: 404 });
// 		}
// 		return NextResponse.json(updatedConstruction);
// 	} catch (error) {
// 		return new Response(JSON.stringify(error), { status: 500 });
// 	}
// }

// export async function DELETE(req: NextRequest) {
// 	await dbConnect();
// 	const constructionId = req.nextUrl.searchParams.get('constructionId');

// 	try {
// 		let deleteResult;
// 		if (constructionId) {
// 			deleteResult = await ConstructionModel.deleteOne({
// 				Construction_id: constructionId,
// 			});
// 		} else {
// 			const deleteAll = req.nextUrl.searchParams.get('deleteAll');
// 			if (deleteAll === 'true') {
// 				deleteResult = await ConstructionModel.deleteMany({});
// 			} else {
// 				return new Response(null, { status: 400 });
// 			}
// 		}

// 		if (deleteResult.deletedCount === 0) {
// 			return new Response(null, { status: 404 });
// 		}

// 		return new Response(null, { status: 204 });
// 	} catch (error) {
// 		return new Response(JSON.stringify(error), { status: 500 });
// 	}
// }
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../utils/mongodb'; // Adjust the import path as necessary
import ConstructionModel from '../../../models/constructions'; // Adjust the import path as necessary

export async function GET(req: NextRequest) {
	await dbConnect();
	const constructionId = req.nextUrl.searchParams.get('constructionId');
	try {
		if (constructionId) {
			const construction = await ConstructionModel.findOne({
				Construction_id: constructionId,
			});
			if (!construction) {
				return new Response(null, { status: 404 });
			}
			return NextResponse.json(construction);
		} else {
			const constructions = await ConstructionModel.find({});
			return NextResponse.json(constructions);
		}
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	await dbConnect();
	try {
		const body = await req.json();
		const construction = new ConstructionModel(body);
		await construction.save();
		return NextResponse.json(construction);
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}

export async function PUT(req: NextRequest) {
	await dbConnect();
	const constructionId = req.nextUrl.searchParams.get('constructionId');
	try {
		const body = await req.json();
		const updatedConstruction = await ConstructionModel.updateOne(
			{ Construction_id: constructionId },
			body,
		);
		if (!updatedConstruction) {
			return new Response(null, { status: 404 });
		}
		return NextResponse.json(updatedConstruction);
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	await dbConnect();
	const constructionId = req.nextUrl.searchParams.get('constructionId');
	try {
		let deleteResult;
		if (constructionId) {
			deleteResult = await ConstructionModel.deleteOne({
				Construction_id: constructionId,
			});
		} else {
			const deleteAll = req.nextUrl.searchParams.get('deleteAll');
			if (deleteAll === 'true') {
				deleteResult = await ConstructionModel.deleteMany({});
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
