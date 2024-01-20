import { Schema, model, Types } from 'mongoose';

// Step 1: Create an interface representing a document in MongoDB.
interface IConstruction {
	Construction_id: string;
	Construction_company: string;
	Construction_name: string;
	Construction_address: string;
	Construction_coordinates: string;
	Construction_description: string;
	Construction_logo: string;
	Construction_website: string;
	Construction_country: string;
	Construction_city: string;
	Construction_deadline: string;
	Construction_drawing_file: string;
	Construction_categories: Types.ObjectId[]; // Array of ObjectIds referencing Construction_category
}

// Step 2: Create a Schema corresponding to the document interface.
const ConstructionSchema = new Schema<IConstruction>(
	{
		Construction_id: { type: String, required: true, unique: true },
		Construction_company: { type: String, required: true },
		Construction_name: { type: String, required: true },
		Construction_address: { type: String, required: true },
		Construction_coordinates: { type: String, required: true },
		Construction_description: { type: String, required: true },
		Construction_logo: { type: String, required: true },
		Construction_website: { type: String, required: true },
		Construction_country: { type: String, required: true },
		Construction_city: { type: String, required: true },
		Construction_deadline: { type: String, required: true },
		Construction_drawing_file: { type: String, required: true },
		Construction_categories: [
			{ type: Types.ObjectId, ref: 'Construction_category' },
		], // Reference to multiple Construction_category documents
	},
	{ timestamps: true },
);

// Step 3: Create a Model.
const ConstructionModel = model<IConstruction>(
	'Construction',
	ConstructionSchema,
);

export default ConstructionModel;
