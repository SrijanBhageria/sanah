import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for the Blog document
export interface IBlog extends Document {
  _id: string;
  blogId: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  typeId?: string;
  image?: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: Date;
  viewCount?: number;
  readTime?: number; // in minutes
  isDeleted?: boolean;
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
      required: false,
      trim: true,
      maxlength: [200, 'Blog title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: [200, 'Blog slug cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: false,
    },
    excerpt: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, 'Blog excerpt cannot exceed 500 characters'],
    },
    author: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    typeId: {
      type: String,
      required: false,
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
      default: true,
    },
    publishedAt: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 1,
    },
    readTime: {
      type: Number,
      required: false,
      min: [1, 'Read time must be at least 1 minute'],
      max: [120, 'Read time cannot exceed 120 minutes'],
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
