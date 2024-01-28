import { Schema, Types, model, models } from 'mongoose';

// Step 1: Create an interface representing a document in MongoDB.
interface IQuotation {
	companyId: Types.ObjectId;
	Quotation_file: string;
	Quotation_date: string;
}

// Step 2: Create a Schema corresponding to the document interface.
const QuotationSchema = new Schema<IQuotation>(
	{
		companyId: { type: Schema.Types.ObjectId, required: true },
		Quotation_file: { type: String, required: true },
		Quotation_date: { type: String, required: true },
	},
	{ timestamps: true },
);

// Step 3: Create a Model.
const QuotationModel = models.Quotation || model('Quotation', QuotationSchema);

export default QuotationModel;
