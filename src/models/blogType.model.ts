import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for the BlogType document
export interface IBlogType extends Document {
  _id: string;
  typeId: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const blogTypeSchema = new Schema<IBlogType>(
  {
    typeId: {
      type: String,
      required: [true, 'Type ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Blog type name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Blog type name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Blog type slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: [100, 'Blog type slug cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
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
// Note: typeId, slug, and name indexes are created automatically by unique: true
blogTypeSchema.index({ isActive: 1, isDeleted: 1 });
blogTypeSchema.index({ isDeleted: 1 });

// Create and export the Mongoose model
export const BlogType = mongoose.model<IBlogType>('BlogType', blogTypeSchema);
