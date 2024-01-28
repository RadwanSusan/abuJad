import { Schema, model, Types, models } from 'mongoose';

// Step 1: Create an interface representing a document in MongoDB.
interface IConstruction_category {
	Construction_id: string;
	Category_name: string;
	Category_description: string;
	Category_image: string;
	Category_deadline: string;
	Category_status: string;
	Category_state: string;
	Category_suppliers: Types.Array<string>;
}

// Step 2: Create a Schema corresponding to the document interface.
const Construction_categoriesSchema = new Schema<IConstruction_category>(
	{
		Construction_id: {
			type: String,
			required: true,
			unique: true,
			ref: 'Construction',
		},
		Category_name: { type: String, required: true },
		Category_description: { type: String, required: true },
		Category_image: { type: String, required: true },
		Category_deadline: { type: String, required: true },
		Category_status: { type: String, required: true },
		Category_state: { type: String, required: true },
		Category_suppliers: { type: [String], default: [] },
	},
	{ timestamps: true },
);

const Construction_categoriesModel =
	models.Construction_categories ||
	model<IConstruction_category>(
		'Construction_categories',
		Construction_categoriesSchema,
	);

export default Construction_categoriesModel;
