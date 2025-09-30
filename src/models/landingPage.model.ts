import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for the LandingPage document
export interface ILandingPage extends Document {
  _id: string;
  header: string;
  subtitle: string;
  numbers: {
    value: string;
    label: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const landingPageSchema = new Schema<ILandingPage>(
  {
    header: {
      type: String,
      required: [true, 'Header is required'],
      trim: true,
      maxlength: [200, 'Header cannot exceed 200 characters'],
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
      maxlength: [500, 'Subtitle cannot exceed 500 characters'],
    },
    numbers: [
      {
        value: {
          type: String,
          required: [true, 'Number value is required'],
          trim: true,
          maxlength: [50, 'Number value cannot exceed 50 characters'],
        },
        label: {
          type: String,
          required: [true, 'Number label is required'],
          trim: true,
          maxlength: [100, 'Number label cannot exceed 100 characters'],
        },
        _id: false, // Prevent Mongoose from creating an _id for subdocuments
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Create and export the Mongoose model
export const LandingPage = mongoose.model<ILandingPage>('LandingPage', landingPageSchema);
