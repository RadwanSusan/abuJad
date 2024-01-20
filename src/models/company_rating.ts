import { Schema, model } from 'mongoose';

// Step 1: Create an interface representing a document in MongoDB.
interface IRating {
	Rating_id: string;
	Constructer_rating: number;
	Rating_description: string;
}

// Step 2: Create a Schema corresponding to the document interface.
const RatingSchema = new Schema<IRating>(
	{
		Rating_id: { type: String, required: true, unique: true },
		Constructer_rating: { type: Number, required: true },
		Rating_description: { type: String, required: true },
	},
	{ timestamps: true },
);

// Step 3: Create a Model.
const RatingModel = model<IRating>('Rating', RatingSchema);

export default RatingModel;
