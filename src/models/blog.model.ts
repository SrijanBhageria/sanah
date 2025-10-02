import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for the Blog document
export interface IBlog extends Document {
  _id: string;
  blogId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  typeId: string;
  image?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  viewCount: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const blogSchema = new Schema<IBlog>(
  {
    blogId: {
      type: String,
      required: [true, 'Blog ID is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Blog title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: [200, 'Blog slug cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Blog excerpt is required'],
      trim: true,
      maxlength: [500, 'Blog excerpt cannot exceed 500 characters'],
    },
    author: {
      type: String,
      required: [true, 'Blog author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    typeId: {
      type: String,
      required: [true, 'Blog type is required'],
    },
    image: {
      type: String,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [50, 'Tag cannot exceed 50 characters'],
    }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
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
// Note: blogId and slug indexes are created automatically by unique: true
blogSchema.index({ typeId: 1, isPublished: 1, isDeleted: 1, publishedAt: -1 });
blogSchema.index({ isPublished: 1, isDeleted: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ author: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ isDeleted: 1 });
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' }); // Text search index

// Pre-save middleware to set publishedAt when isPublished becomes true
blogSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Create and export the Mongoose model
export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
