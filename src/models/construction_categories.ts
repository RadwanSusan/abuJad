import { Schema, model, Types } from 'mongoose';

// Step 1: Create an interface representing a document in MongoDB.
interface IConstruction_category {
	_id: Types.ObjectId;
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
		_id: { type: Schema.Types.ObjectId, required: true, unique: true },
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

// Step 3: Create a Model.
const Construction_categoriesModel = model<IConstruction_category>(
	'Construction_categories',
	Construction_categoriesSchema,
);

export default Construction_categoriesModel;
