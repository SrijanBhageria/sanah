import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for footer contact information
export interface IFooterContact {
  email: string;
  phone: string;
  address: string;
}

// TypeScript interface for footer link
export interface IFooterLink {
  text: string;
  url?: string;
}

// TypeScript interface for footer section
export interface IFooterSection {
  title: string;
  links: IFooterLink[];
}

// TypeScript interface for social media link
export interface ISocialMediaLink {
  platform: string;
  url: string;
  icon?: string;
}

// TypeScript interface for the Footer document
export interface IFooterDocument extends Document {
  _id: string;
  footerId: string;
  companyName: string;
  companyDescription: string;
  contact: IFooterContact;
  sections: IFooterSection[];
  socialMedia: ISocialMediaLink[];
  backToTopText: string;
  copyrightText: string;
  legalLinks: IFooterLink[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition for footer contact
const footerContactSchema = new Schema<IFooterContact>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [100, 'Email cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      maxlength: [50, 'Phone cannot exceed 50 characters'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
  },
  { _id: false }, // Do not create _id for subdocuments
);

// Mongoose schema definition for footer link
const footerLinkSchema = new Schema<IFooterLink>(
  {
    text: {
      type: String,
      required: [true, 'Link text is required'],
      trim: true,
      maxlength: [100, 'Link text cannot exceed 100 characters'],
    },
    url: {
      type: String,
      trim: true,
      maxlength: [500, 'URL cannot exceed 500 characters'],
    },
  },
  { _id: false }, // Do not create _id for subdocuments
);

// Mongoose schema definition for footer section
const footerSectionSchema = new Schema<IFooterSection>(
  {
    title: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true,
      maxlength: [100, 'Section title cannot exceed 100 characters'],
    },
    links: {
      type: [footerLinkSchema],
      default: [],
    },
  },
  { _id: false }, // Do not create _id for subdocuments
);

// Mongoose schema definition for social media link
const socialMediaLinkSchema = new Schema<ISocialMediaLink>(
  {
    platform: {
      type: String,
      required: [true, 'Social media platform is required'],
      trim: true,
      maxlength: [50, 'Platform name cannot exceed 50 characters'],
    },
    url: {
      type: String,
      required: [true, 'Social media URL is required'],
      trim: true,
      maxlength: [500, 'URL cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [100, 'Icon cannot exceed 100 characters'],
    },
  },
  { _id: false }, // Do not create _id for subdocuments
);

// Mongoose schema definition for the Footer
const footerSchema = new Schema<IFooterDocument>(
  {
    footerId: {
      type: String,
      required: [true, 'Footer ID is required'],
      unique: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    companyDescription: {
      type: String,
      required: [true, 'Company description is required'],
      trim: true,
      maxlength: [1000, 'Company description cannot exceed 1000 characters'],
    },
    contact: {
      type: footerContactSchema,
      required: [true, 'Contact information is required'],
    },
    sections: {
      type: [footerSectionSchema],
      default: [],
    },
    socialMedia: {
      type: [socialMediaLinkSchema],
      default: [],
    },
    backToTopText: {
      type: String,
      required: [true, 'Back to top text is required'],
      trim: true,
      maxlength: [100, 'Back to top text cannot exceed 100 characters'],
    },
    copyrightText: {
      type: String,
      required: [true, 'Copyright text is required'],
      trim: true,
      maxlength: [500, 'Copyright text cannot exceed 500 characters'],
    },
    legalLinks: {
      type: [footerLinkSchema],
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
footerSchema.index({ footerId: 1, isDeleted: 1 });
footerSchema.index({ isDeleted: 1 });

// Create and export the Mongoose model
export const Footer = mongoose.model<IFooterDocument>('Footer', footerSchema);
