import { Schema, model, models, Types } from 'mongoose';

// Step 1: Create an interface representing a document in MongoDB.
interface ICompany {
	Company_id: string;
	Company_name: string;
	Company_email: string;
	Company_address: string;
	Company_phone: string;
	Company_password: string;
	Company_description: string;
	Company_logo: string;
	Company_website: string;
	Company_country: string;
	Company_city: string;
	Company_certificate: string;
	Company_fieldsOfWork: Types.Array<string>;
	Company_industries: string;
	Company_subscription: string;
	Company_rating: number;
	Company_type: string;
	quotations?: Types.ObjectId[]; // Optional field, only for 'constructer' type
	constructions?: Types.ObjectId[]; // Optional field, only for 'constructer' type
	Category_suppliers?: Types.ObjectId[];
	Company_isActive: boolean;
	Company_constructions: Types.Array<string>;
	Company_quotations: Types.Array<string>;
}

// Step 2: Create a Schema corresponding to the document interface.
const companySchema = new Schema<ICompany>(
	{
		Company_id: { type: String, required: true, unique: true },
		Company_name: { type: String, required: true },
		Company_email: { type: String, required: true },
		Company_address: { type: String, required: true },
		Company_phone: { type: String, required: true },
		Company_password: { type: String, required: true },
		Company_description: { type: String, required: true },
		Company_logo: { type: String, required: true },
		Company_website: { type: String, required: true },
		Company_country: { type: String, required: true },
		Company_city: { type: String, required: true },
		Company_certificate: { type: String, required: true },
		Company_fieldsOfWork: { type: [String], required: true },
		Company_industries: { type: String, required: true },
		Company_subscription: { type: String, required: true },
		Company_rating: { type: Number, required: true, default: 0 },
		Company_type: { type: String, required: true },
		quotations: {
			type: [{ type: Schema.Types.ObjectId, ref: 'Quotation' }],
			default: undefined, // Set default as undefined so the field is optional
		},
		constructions: {
			type: [{ type: Schema.Types.ObjectId, ref: 'ConstructionCategory' }],
			default: undefined, // Set default as undefined so the field is optional
		},
		Category_suppliers: {
			type: [{ type: Schema.Types.ObjectId, ref: 'ConstructionCategory' }],
			default: undefined, // Set default as undefined so the field is optional
		},
		Company_isActive: { type: Boolean, required: true, default: true },
		Company_constructions: { type: [String], default: [] },
		Company_quotations: { type: [String], default: [] },
	},
	{ timestamps: true },
);

companySchema.pre('save', function (next) {
	// Clear the constructions array if the company type is not 'constructer'
	if (this.Company_type !== 'constructer') {
		this.constructions = undefined;
		this.quotations = undefined; // Clear quotations if not 'constructer'
	}

	// Clear the Category_suppliers array if the company type is not 'supplier'
	if (this.Company_type !== 'supplier') {
		this.Category_suppliers = undefined;
	}

	next();
});

export default models.Company || model<ICompany>('Company', companySchema);
