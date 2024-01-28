// models/supplierRating.ts
import { Schema, model, models, Types } from 'mongoose';

interface ISupplierRating {
	companyId: Types.ObjectId; // Reference to Company
	rating: number;
	comment: string;
}

const SupplierRatingSchema = new Schema<ISupplierRating>(
	{
		companyId: {
			type: Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		rating: { type: Number, required: true },
		comment: { type: String, required: true },
	},
	{ timestamps: true },
);

const SupplierRatingModel =
	models.SupplierRating ||
	model<ISupplierRating>('SupplierRating', SupplierRatingSchema);

export default SupplierRatingModel;
