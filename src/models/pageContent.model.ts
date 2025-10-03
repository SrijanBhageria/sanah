import mongoose, { Document, Schema } from 'mongoose';
import { PageType, IPageItem } from './pageTypes';

// TypeScript interface for the PageContent document
export interface IPageContentDocument extends Document {
  _id: string;
  pageContentId: string;
  pageType: PageType;
  title?: string;
  slug?: string; // SEO-friendly URL slug
  content?: string;
  subtitle?: string;
  items?: IPageItem[];
  numbers?: Array<{ value: string; label: string }>; // For landing pages
  btnTxt?: Array<{ buttonText: string }>; // Button text array
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition for a page item
const pageItemSchema = new Schema<IPageItem>(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      maxlength: [200, 'Item title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
      maxlength: [1000, 'Item description cannot exceed 1000 characters'],
    },
  },
  { _id: false }, // Do not create _id for subdocuments
);

// Mongoose schema definition for numbers (landing page)
const numberItemSchema = new Schema(
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
  },
  { _id: false }, // Do not create _id for subdocuments
);

// Mongoose schema definition for button text
const buttonTextSchema = new Schema(
  {
    buttonText: {
      type: String,
      required: [true, 'Button text is required'],
      trim: true,
      maxlength: [100, 'Button text cannot exceed 100 characters'],
    },
  },
  { _id: false }, // Do not create _id for subdocuments
);

// Mongoose schema definition for the PageContent
const pageContentSchema = new Schema<IPageContentDocument>(
  {
    pageContentId: {
      type: String,
      required: [true, 'Page Content ID is required'],
      unique: true,
      trim: true,
    },
    pageType: {
      type: String,
      required: [true, 'Page type is required'],
      enum: Object.values(PageType),
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [200, 'Slug cannot exceed 200 characters'],
    },
    content: {
      type: String,
      trim: true,
      maxlength: [5050, 'Content cannot exceed 5050 characters'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [500, 'Subtitle cannot exceed 500 characters'],
    },
    items: {
      type: [pageItemSchema],
      default: [],
    },
    numbers: {
      type: [numberItemSchema],
      default: [],
    },
    btnTxt: {
      type: [buttonTextSchema],
      default: [],
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
pageContentSchema.index({ pageContentId: 1, isDeleted: 1 });
pageContentSchema.index({ pageType: 1, isDeleted: 1 });
pageContentSchema.index({ slug: 1, isDeleted: 1 }); // For SEO-friendly URL lookups
pageContentSchema.index({ isDeleted: 1 });

// Create and export the Mongoose model
export const PageContent = mongoose.model<IPageContentDocument>('PageContent', pageContentSchema);
