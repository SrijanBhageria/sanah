# 🚀 Sanah Backend API Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
- [Blog API](#blog-api)
- [Unified Page Content API](#unified-page-content-api)
- [Frontend Integration Examples](#frontend-integration-examples)
- [Testing Commands](#testing-commands)

## Overview

This backend API provides a complete CMS (Content Management System) for managing website content including landing pages, blog posts, and story pages. All APIs follow RESTful principles and include comprehensive security features.

## Base URL

```
http://localhost:5050
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible with rate limiting protection.

## Rate Limiting

- **General API**: 1000 requests per 15 minutes per IP
- **Blog Write Operations**: 100 requests per 15 minutes per IP
- **Page Content Write Operations**: 100 requests per 15 minutes per IP

## Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "data": null
}
```

## API Endpoints

---

## Blog API

### 1. Get All Types with Blogs
**GET** `/blog/getTypesWithBlogs?limit=5&admin=false`

Retrieves all blog types with their associated blogs.

#### Query Parameters
- `limit` (optional): Number of blogs per type (default: 5)
- `admin` (optional): Include unpublished blogs (default: false)

#### Response
```json
{
  "success": true,
  "message": "Types with blogs retrieved successfully",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "typeId": "type-uuid-1",
      "name": "Technology",
      "slug": "technology",
      "description": "Latest technology trends",
      "blogs": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "blogId": "blog-uuid-1",
          "title": "Getting Started with Node.js",
          "slug": "getting-started-with-nodejs",
          "excerpt": "Learn the basics of Node.js development",
          "author": "John Doe",
          "image": "https://example.com/image.jpg",
          "tags": ["nodejs", "javascript"],
          "publishedAt": "2023-09-05T10:30:00.000Z",
          "viewCount": 150
        }
      ]
    }
  ]
}
```

### 2. Get Blogs by Type
**GET** `/blog/getBlogsByType?typeId=type-uuid-1&page=1&limit=10`

Retrieves blogs for a specific type with pagination.

#### Query Parameters
- `typeId` (required): The blog type ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Blogs per page (default: 10)

#### Response
```json
{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": {
    "blogs": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "blogId": "blog-uuid-1",
        "title": "Getting Started with Node.js",
        "slug": "getting-started-with-nodejs",
        "excerpt": "Learn the basics of Node.js development",
        "author": "John Doe",
        "typeId": "type-uuid-1",
        "image": "https://example.com/image.jpg",
        "tags": ["nodejs", "javascript"],
        "isPublished": true,
        "publishedAt": "2023-09-05T10:30:00.000Z",
        "viewCount": 150,
        "createdAt": "2023-09-05T10:30:00.000Z",
        "updatedAt": "2023-09-05T10:30:00.000Z"
      }
    ],
    "total": 25,
    "totalPages": 3
  }
}
```

### 3. Get Blog by ID
**GET** `/blog/getBlogByBlogId?blogId=blog-uuid-1&admin=false`

Retrieves a specific blog by its ID.

#### Query Parameters
- `blogId` (required): The blog ID
- `admin` (optional): Include unpublished blogs (default: false)

#### Response
```json
{
  "success": true,
  "message": "Blog retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "blogId": "blog-uuid-1",
    "title": "Getting Started with Node.js",
    "slug": "getting-started-with-nodejs",
    "content": "<p>Node.js is a powerful JavaScript runtime...</p>",
    "excerpt": "Learn the basics of Node.js development",
    "author": "John Doe",
    "typeId": "type-uuid-1",
    "image": "https://example.com/image.jpg",
    "tags": ["nodejs", "javascript"],
    "isPublished": true,
    "publishedAt": "2023-09-05T10:30:00.000Z",
    "viewCount": 150,
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 4. Get All Blog Types
**GET** `/blog/getBlogTypes`

Retrieves all active blog types.

#### Response
```json
{
  "success": true,
  "message": "Blog types retrieved successfully",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "typeId": "type-uuid-1",
      "name": "Technology",
      "slug": "technology",
      "description": "Latest technology trends",
      "isActive": true,
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ]
}
```

### 5. Create Blog
**POST** `/blog/createBlog`

Creates a new blog post.

#### Request Body
```json
{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "content": "<p>This is the blog content...</p>",
  "excerpt": "Brief description of the blog",
  "author": "Jane Smith",
  "typeId": "type-uuid-1",
  "image": "https://example.com/image.jpg",
  "tags": ["javascript", "tutorial"],
  "isPublished": true
}
```

#### Response
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "blogId": "blog-uuid-3",
    "title": "New Blog Post",
    "slug": "new-blog-post",
    "content": "<p>This is the blog content...</p>",
    "excerpt": "Brief description of the blog",
    "author": "Jane Smith",
    "typeId": "type-uuid-1",
    "image": "https://example.com/image.jpg",
    "tags": ["javascript", "tutorial"],
    "isPublished": true,
    "publishedAt": "2023-09-05T10:35:00.000Z",
    "viewCount": 0,
    "createdAt": "2023-09-05T10:35:00.000Z",
    "updatedAt": "2023-09-05T10:35:00.000Z"
  }
}
```

### 6. Update Blog
**POST** `/blog/updateBlog?blogId=blog-uuid-1`

Updates an existing blog post.

#### Query Parameters
- `blogId` (required): The blog ID to update

#### Request Body
```json
{
  "title": "Updated Blog Title",
  "content": "<p>Updated content...</p>",
  "isPublished": false
}
```

#### Response
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "blogId": "blog-uuid-1",
    "title": "Updated Blog Title",
    "content": "<p>Updated content...</p>",
    "isPublished": false,
    "updatedAt": "2023-09-05T10:40:00.000Z"
  }
}
```

### 7. Delete Blog
**POST** `/blog/deleteBlog?blogId=blog-uuid-1`

Soft deletes a blog post.

#### Query Parameters
- `blogId` (required): The blog ID to delete

#### Response
```json
{
  "success": true,
  "message": "Blog deleted successfully",
  "data": true
}
```

### 8. Create Blog Type
**POST** `/blog/createBlogType`

Creates a new blog type.

#### Request Body
```json
{
  "name": "Design",
  "slug": "design",
  "description": "Design-related articles and tutorials",
  "isActive": true
}
```

#### Response
```json
{
  "success": true,
  "message": "Blog type created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "typeId": "type-uuid-4",
    "name": "Design",
    "slug": "design",
    "description": "Design-related articles and tutorials",
    "isActive": true,
    "createdAt": "2023-09-05T10:35:00.000Z",
    "updatedAt": "2023-09-05T10:35:00.000Z"
  }
}
```

### 9. Update Blog Type
**POST** `/blog/updateBlogType?typeId=type-uuid-1`

Updates an existing blog type.

#### Query Parameters
- `typeId` (required): The blog type ID to update

#### Request Body
```json
{
  "name": "Updated Technology",
  "description": "Updated description for technology posts"
}
```

#### Response
```json
{
  "success": true,
  "message": "Blog type updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "typeId": "type-uuid-1",
    "name": "Updated Technology",
    "description": "Updated description for technology posts",
    "updatedAt": "2023-09-05T10:40:00.000Z"
  }
}
```

### 10. Delete Blog Type
**POST** `/blog/deleteBlogType?typeId=type-uuid-1`

Soft deletes a blog type.

#### Query Parameters
- `typeId` (required): The blog type ID to delete

#### Response
```json
{
  "success": true,
  "message": "Blog type deleted successfully",
  "data": true
}
```

---

## Unified Page Content API

### 1. Get Page Content by Type
**GET** `/page/getPageContent?pageType=story`

Retrieves page content by page type. Supported page types: `story`, `leadershipTeam`, `landing`.

#### Response
```json
{
  "success": true,
  "message": "story page content retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "pageContentId": "story-uuid-1",
    "pageType": "story",
    "title": "Our Story",
    "slug": "our-story",
    "content": "Discover the journey that brought us here and the vision that drives us forward.",
    "items": [
      {
        "title": "Our Foundation",
        "description": "Founded in 2020 with a vision to revolutionize digital solutions and transform how businesses operate in the digital age."
      },
      {
        "title": "Growth & Expansion",
        "description": "Expanded to serve 100+ clients across multiple industries, delivering innovative solutions that drive real business value."
      }
    ],
    "btnTxt": [
      {
        "buttonText": "Learn More"
      },
      {
        "buttonText": "Get Started"
      }
    ],
    "isDeleted": false,
    "deletedAt": null,
    "numbers": [],
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 2. Get Landing Page
**GET** `/page/getPageContent?pageType=landing`

Retrieves the landing page content with numbers and statistics.

#### Response
```json
{
  "success": true,
  "message": "landing page content retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
    "pageContentId": "landing-uuid-1",
    "pageType": "landing",
    "title": "Welcome to Our Platform",
    "slug": "home",
    "subtitle": "Your trusted partner for digital solutions and innovation",
    "numbers": [
      {
        "value": "100+",
        "label": "Happy Clients"
      },
      {
        "value": "50+",
        "label": "Projects Completed"
      },
      {
        "value": "5+",
        "label": "Years Experience"
      },
      {
        "value": "24/7",
        "label": "Support Available"
      }
    ],
    "btnTxt": [
      {
        "buttonText": "Get Started"
      },
      {
        "buttonText": "Learn More"
      },
      {
        "buttonText": "Contact Us"
      }
    ],
    "isDeleted": false,
    "deletedAt": null,
    "items": [],
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 3. Get Leadership Team
**GET** `/page/getPageContent?pageType=leadershipTeam`

Retrieves the leadership team content with member cards.

#### Response
```json
{
  "success": true,
  "message": "leadershipTeam page content retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
    "pageContentId": "leadership-uuid-1",
    "pageType": "leadershipTeam",
    "title": "Leadership Team",
    "slug": "leadership-team",
    "subtitle": "Meet the experienced professionals leading our firm",
    "items": [
      {
        "title": "Sarah Mitchell",
        "description": "Chief Executive Officer"
      },
      {
        "title": "David Chen",
        "description": "Chief Investment Officer"
      }
    ],
    "btnTxt": [
      {
        "buttonText": "Contact Team"
      },
      {
        "buttonText": "View Profiles"
      }
    ],
    "isDeleted": false,
    "deletedAt": null,
    "numbers": [],
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### 4. Get All Page Content
**GET** `/page/getAllPageContent`

Retrieves all page content types.

#### Response
```json
{
  "success": true,
  "message": "All page content retrieved successfully",
  "data": [
    {
      "pageType": "story",
      "title": "Our Story",
      "content": "Discover our journey...",
      "items": [...]
    },
    {
      "pageType": "leadershipTeam", 
      "title": "Leadership Team",
      "subtitle": "Meet our professionals",
      "items": [...]
    },
    {
      "pageType": "landing",
      "title": "Welcome to Our Platform",
      "subtitle": "Your trusted partner",
      "numbers": [...]
    }
  ]
}
```

### 5. Create or Update Page Content
**POST** `/page/createOrUpdatePageContent`

Creates new page content or updates existing content for any page type.

#### Request Body Examples

**Story Page:**
```json
{
  "pageType": "story",
  "title": "Our Company Story",
  "slug": "our-company-story",
  "content": "Learn about our journey and mission to transform the digital landscape.",
  "items": [
    {
      "title": "The Beginning",
      "description": "Started as a small team with big dreams and innovative ideas."
    },
    {
      "title": "Our Mission",
      "description": "Dedicated to providing cutting-edge solutions that drive business success."
    }
  ],
  "btnTxt": [
    {
      "buttonText": "Learn More"
    },
    {
      "buttonText": "Get Started"
    }
  ]
}
```

**Leadership Team:**
```json
{
  "pageType": "leadershipTeam",
  "title": "Our Leadership Team",
  "slug": "our-leadership-team",
  "subtitle": "Meet the visionaries driving our success",
  "items": [
    {
      "title": "John Smith",
      "description": "Chief Executive Officer"
    },
    {
      "title": "Jane Doe",
      "description": "Chief Technology Officer"
    }
  ],
  "btnTxt": [
    {
      "buttonText": "Contact Team"
    },
    {
      "buttonText": "View Profiles"
    }
  ]
}
```

**Landing Page:**
```json
{
  "pageType": "landing",
  "title": "Welcome to Our Platform",
  "slug": "home",
  "subtitle": "Your trusted partner for digital solutions",
  "numbers": [
    {
      "value": "150+",
      "label": "Happy Clients"
    },
    {
      "value": "75+",
      "label": "Projects Completed"
    }
  ],
  "btnTxt": [
    {
      "buttonText": "Get Started"
    },
    {
      "buttonText": "Learn More"
    },
    {
      "buttonText": "Contact Us"
    }
  ]
}
```

#### Response
```json
{
  "success": true,
  "message": "Story page created or updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
    "storyPageId": "story-uuid-1",
    "title": "Our Company Story",
    "content": "Learn about our journey and mission to transform the digital landscape.",
    "carouselItems": [
      {
        "title": "The Beginning",
        "description": "Started as a small team with big dreams and innovative ideas."
      },
      {
        "title": "Our Mission",
        "description": "Dedicated to providing cutting-edge solutions that drive business success."
      },
      {
        "title": "Future Vision",
        "description": "Continuing to innovate and expand our impact in the digital world."
      }
    ],
    "createdAt": "2023-09-05T10:30:00.000Z",
    "updatedAt": "2023-09-05T10:45:00.000Z"
  }
}
```

---

## Field Descriptions

### Page Content Fields

| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `pageType` | String | Type of page content | Yes | `"story"`, `"leadershipTeam"`, `"landing"` |
| `title` | String | Main title of the page | No | `"Our Company Story"` |
| `slug` | String | SEO-friendly URL slug | No | `"our-company-story"` |
| `content` | String | Main content (HTML supported) | No | `"<h1>Welcome</h1><p>Content here</p>"` |
| `subtitle` | String | Subtitle or description | No | `"Your trusted partner"` |
| `items` | Array | Page items (cards, team members, etc.) | No | `[{"title": "Item 1", "description": "Description"}]` |
| `numbers` | Array | Statistics/numbers (landing page) | No | `[{"value": "100+", "label": "Clients"}]` |
| `btnTxt` | Array | Button text array | No | `[{"buttonText": "Get Started"}]` |

### Button Text Field (`btnTxt`)

The `btnTxt` field is an array of objects containing button text for dynamic button generation:

```json
{
  "btnTxt": [
    {
      "buttonText": "Get Started"
    },
    {
      "buttonText": "Learn More"
    },
    {
      "buttonText": "Contact Us"
    }
  ]
}
```

**Validation Rules:**
- Each `buttonText` must be a non-empty string
- Maximum 100 characters per button text
- XSS protection applied (script tags removed)
- Trimmed whitespace

### Slug Field

The `slug` field provides SEO-friendly URLs:

- **Format**: Lowercase, hyphen-separated
- **Example**: `"our-company-story"`
- **Usage**: Used for URL routing and SEO optimization
- **Validation**: Max 200 characters, trimmed, lowercase

---

## Frontend Integration Examples

### React/Next.js Example

```javascript
// API Base URL
const API_BASE_URL = 'http://localhost:5050';

// Page Content Service
export const pageContentService = {
  async getPageContent(pageType) {
    const response = await fetch(`${API_BASE_URL}/page/getPageContent?pageType=${pageType}`);
    return response.json();
  },

  async getAllPageContent() {
    const response = await fetch(`${API_BASE_URL}/page/getAllPageContent`);
    return response.json();
  },

  async updatePageContent(data) {
    const response = await fetch(`${API_BASE_URL}/page/createOrUpdatePageContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};

// Blog Service
export const blogService = {
  async getTypesWithBlogs(limit = 5, admin = false) {
    const response = await fetch(
      `${API_BASE_URL}/blog/getTypesWithBlogs?limit=${limit}&admin=${admin}`
    );
    return response.json();
  },

  async getBlogsByType(typeId, page = 1, limit = 10) {
    const response = await fetch(
      `${API_BASE_URL}/blog/getBlogsByType?typeId=${typeId}&page=${page}&limit=${limit}`
    );
    return response.json();
  },

  async createBlog(blogData) {
    const response = await fetch(`${API_BASE_URL}/blog/createBlog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });
    return response.json();
  }
};

```

### Vue.js Example

```javascript
// API Service
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5050',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Page Content
export const getPageContent = (pageType) => api.get(`/page/getPageContent?pageType=${pageType}`);
export const getAllPageContent = () => api.get('/page/getAllPageContent');
export const updatePageContent = (data) => api.post('/page/createOrUpdatePageContent', data);

// Blog
export const getTypesWithBlogs = (limit, admin) => 
  api.get(`/blog/getTypesWithBlogs?limit=${limit}&admin=${admin}`);
export const getBlogsByType = (typeId, page, limit) => 
  api.get(`/blog/getBlogsByType?typeId=${typeId}&page=${page}&limit=${limit}`);
export const createBlog = (data) => api.post('/blog/createBlog', data);

```

### Angular Example

```typescript
// API Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5050';

  constructor(private http: HttpClient) {}

  // Page Content
  getPageContent(pageType: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/page/getPageContent?pageType=${pageType}`);
  }

  getAllPageContent(): Observable<any> {
    return this.http.get(`${this.baseUrl}/page/getAllPageContent`);
  }

  updatePageContent(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/page/createOrUpdatePageContent`, data);
  }

  // Blog
  getTypesWithBlogs(limit = 5, admin = false): Observable<any> {
    return this.http.get(`${this.baseUrl}/blog/getTypesWithBlogs?limit=${limit}&admin=${admin}`);
  }

  getBlogsByType(typeId: string, page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/blog/getBlogsByType?typeId=${typeId}&page=${page}&limit=${limit}`);
  }

  createBlog(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/blog/createBlog`, data);
  }

}
```

---

## Testing Commands

### Start the Server
```bash
npm run dev
# or
node bin/init
```

### Test Page Content API
```bash
# Get story page
curl -X GET "http://localhost:5050/page/getPageContent?pageType=story"

# Get leadership team
curl -X GET "http://localhost:5050/page/getPageContent?pageType=leadershipTeam"

# Get landing page
curl -X GET "http://localhost:5050/page/getPageContent?pageType=landing"

# Get all page content
curl -X GET http://localhost:5050/page/getAllPageContent

# Update story page
curl -X POST http://localhost:5050/page/createOrUpdatePageContent \
  -H "Content-Type: application/json" \
  -d '{
    "pageType": "story",
    "title": "Our Story",
    "content": "Learn about our journey and mission.",
    "items": [
      {
        "title": "Our Foundation",
        "description": "Founded with a vision to revolutionize digital solutions."
      }
    ]
  }'

# Update landing page
curl -X POST http://localhost:5050/page/createOrUpdatePageContent \
  -H "Content-Type: application/json" \
  -d '{
    "pageType": "landing",
    "title": "Welcome to Our Platform",
    "subtitle": "Your trusted partner for digital solutions",
    "numbers": [
      {"value": "100+", "label": "Happy Clients"},
      {"value": "50+", "label": "Projects Completed"}
    ]
  }'
```

### Test Blog API
```bash
# Get types with blogs
curl -X GET "http://localhost:5050/blog/getTypesWithBlogs?limit=5&admin=false"

# Get blogs by type
curl -X GET "http://localhost:5050/blog/getBlogsByType?typeId=type-uuid-1&page=1&limit=10"

# Create blog
curl -X POST http://localhost:5050/blog/createBlog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Blog Post",
    "slug": "new-blog-post",
    "content": "<p>This is the blog content...</p>",
    "excerpt": "Brief description",
    "author": "Jane Smith",
    "typeId": "type-uuid-1",
    "tags": ["javascript", "tutorial"],
    "isPublished": true
  }'
```


---

## Security Features

- ✅ **XSS Protection**: All text inputs are sanitized using DOMPurify
- ✅ **Rate Limiting**: Prevents abuse with configurable limits
- ✅ **Input Validation**: Joi schemas validate all request data
- ✅ **Error Handling**: Comprehensive error responses with proper HTTP status codes
- ✅ **Audit Logging**: Security events are logged for monitoring
- ✅ **Soft Delete**: Data is never permanently deleted, only marked as deleted

## Support

For questions or issues, please refer to the main README.md file or contact the development team.