import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// TypeScript interface for a section within an investment card
export interface ISection {
  sectionId: string;    // UUID for unique identification
  title?: string;       // "DESCRIPTION", "FOUNDERS", etc.
  content?: any;        // The actual content (string, array, object)
  order?: number;       // Display order (1, 2, 3, etc.)
}

// TypeScript interface for the Investment Card document
export interface IInvestmentCardDocument extends Document {
  _id: string;
  cardId: string;        // UUID for unique identification
  companyName?: string;
  companyLogo?: string;
  sections?: ISection[];
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for a section within an investment card
const sectionSchema = new Schema<ISection>(
  {
    sectionId: {
      type: String,
      required: true,
      default: () => uuidv4(),
      validate: {
        validator: function(v: string) {
          // Basic UUID v4 validation
          return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
        },
        message: 'sectionId must be a valid UUID v4'
      }
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Section title cannot exceed 200 characters'],
    },
    content: {
      type: Schema.Types.Mixed,
    },
    order: {
      type: Number,
      min: [1, 'Section order must be at least 1'],
    },
  },
  { _id: false }, // Do not create _id for subdocuments
);

// Mongoose schema for Investment Card
const investmentCardSchema = new Schema<IInvestmentCardDocument>(
  {
    cardId: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
      validate: {
        validator: function(v: string) {
          // Basic UUID v4 validation
          return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
        },
        message: 'cardId must be a valid UUID v4'
      }
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    companyLogo: {
      type: String,
      trim: true,
      maxlength: [500, 'Company logo URL cannot exceed 500 characters'],
    },
    sections: {
      type: [sectionSchema],
      default: [],
      validate: {
        validator: function(sections: ISection[]) {
          if (!sections || sections.length === 0) return true;
          // Validate that section orders are unique within a card (only if orders are provided)
          const orders = sections.filter(s => s.order !== undefined).map(s => s.order);
          return orders.length === new Set(orders).size;
        },
        message: 'Section orders must be unique within a card',
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for optimal performance
investmentCardSchema.index({ cardId: 1, isDeleted: 1 });
investmentCardSchema.index({ companyName: 1, isDeleted: 1 });
investmentCardSchema.index({ isDeleted: 1 });

// Create and export the Mongoose model
export const InvestmentCard = mongoose.model<IInvestmentCardDocument>('InvestmentCard', investmentCardSchema);
