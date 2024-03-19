import { Schema, model, models, Types } from 'mongoose';

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
	quotations?: Types.ObjectId[];
	constructions?: Types.ObjectId[];
	Category_suppliers?: Types.ObjectId[];
	Company_isActive: boolean;
	Company_constructions: Types.Array<string>;
	Company_quotations: Types.Array<string>;
	Company_otp: number;
}

const companySchema = new Schema<ICompany>(
	{
		Company_id: { type: String, required: true, unique: true },
		Company_name: { type: String, required: true, unique: true },
		Company_email: { type: String, required: true, unique: true },
		Company_address: { type: String },
		Company_phone: { type: String, required: true, unique: true },
		Company_password: { type: String, required: true },
		Company_description: { type: String },
		Company_logo: { type: String },
		Company_website: { type: String },
		Company_country: { type: String },
		Company_city: { type: String },
		Company_certificate: { type: String },
		Company_fieldsOfWork: { type: [String] },
		Company_industries: { type: String },
		Company_subscription: { type: String },
		Company_rating: { type: Number, default: 0 },
		Company_type: { type: String, required: true },
		quotations: {
			type: [{ type: Schema.Types.ObjectId, ref: 'Quotation' }],
			default: undefined,
		},
		constructions: {
			type: [{ type: Schema.Types.ObjectId, ref: 'ConstructionCategory' }],
			default: undefined,
		},
		Category_suppliers: {
			type: [{ type: Schema.Types.ObjectId, ref: 'ConstructionCategory' }],
			default: undefined,
		},
		Company_isActive: { type: Boolean, required: true, default: true },
		Company_constructions: { type: [String], default: [] },
		Company_quotations: { type: [String], default: [] },
		Company_otp: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

companySchema.pre('save', function (next) {
	if (this.Company_type !== 'constructer') {
		this.constructions = undefined;
		this.quotations = undefined;
	}
	if (this.Company_type !== 'supplier') {
		this.Category_suppliers = undefined;
	}
	next();
});

export default models.Company || model<ICompany>('Company', companySchema);
