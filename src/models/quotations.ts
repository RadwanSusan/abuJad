import { Schema, model, Types } from 'mongoose';

// Step 1: Create an interface representing a document in MongoDB.
interface IQuotation {
	_id: Types.ObjectId;
	Quotation_file: string;
	Quotation_date: string;
}

// Step 2: Create a Schema corresponding to the document interface.
const QuotationSchema = new Schema<IQuotation>(
	{
		_id: { type: Schema.Types.ObjectId, required: true, unique: true },
		Quotation_file: { type: String, required: true },
		Quotation_date: { type: String, required: true },
	},
	{ timestamps: true },
);

// Step 3: Create a Model.
const QuotationModel = model<IQuotation>('Quotation', QuotationSchema);

export default QuotationModel;
