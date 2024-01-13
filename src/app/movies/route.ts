// app/movies/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb';
// import Movie from 'path-to-your-models-folder/Movie';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
	try {
		// Connect to the database
		await connectDB();

		// Use Mongoose to find all movies
		// const movies = await Movie.find({});

		// Send the response with the movies
		// res.status(200).json('connectDB');
	} catch (e) {
		// res.status(500).json({ error: e.message });
	}
}

// Add other methods like POST, PUT, DELETE as needed
