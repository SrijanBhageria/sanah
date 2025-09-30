# Sanah Backend API

A Node.js + TypeScript backend API built with Express, MongoDB, and following the MVCS (Model-View-Controller-Service) architecture pattern.

## 🏗️ Project Structure

```
src/
├── main.ts                    # Application entry point
├── init.ts                    # Initialization orchestrator
├── app.ts                     # Express application setup
├── config/
│   ├── env.ts                 # Environment variables management
│   └── db.ts                  # Database connection configuration
├── constants/
│   └── error.constants.ts     # Error codes and messages
├── controllers/               # HTTP request handlers
├── services/                  # Business logic layer
├── models/                    # Mongoose schemas and TypeScript interfaces
├── routes/                    # Express route definitions
├── validators/                # Joi validation schemas
├── middlewares/
│   ├── error.middleware.ts    # Global error handling
│   ├── validate.middleware.ts # Request validation
│   └── auth.middleware.ts     # Authentication & authorization
└── utils/
    ├── logger.ts              # Winston logging configuration
    ├── AppError.ts            # Custom error class
    └── helpers.ts             # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sanah
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/sanah
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=info
   ```

4. **Start MongoDB**
   ```bash
   # On macOS
   mongod --dbpath /usr/local/var/mongodb
   
   # On Linux/Windows
   sudo systemctl start mongod
   ```

### Development

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run initialization only
npm run init
```

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run init` - Run initialization only
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 📁 File Structure Explained

### Core Application Files

#### `src/main.ts` - Application Entry Point
- **Purpose**: Main entry point that starts the entire application
- **Responsibilities**:
  - Calls initialization functions
  - Starts HTTP server
  - Handles server errors
  - Process management

#### `src/init.ts` - Initialization Orchestrator
- **Purpose**: Orchestrates all service initializations
- **Responsibilities**:
  - Connects to MongoDB
  - Initializes other services (Redis, Email, etc.)
  - Handles graceful shutdown
  - Process signal management (SIGTERM, SIGINT)

#### `src/app.ts` - Express Application Setup
- **Purpose**: Configures Express app with middleware
- **Responsibilities**:
  - Sets up security middleware (helmet, CORS)
  - Configures body parsing
  - Sets up logging middleware (morgan)
  - Defines health check endpoint
  - Mounts API routes
  - Sets up error handling

### Configuration Files

#### `src/config/env.ts` - Environment Variables
- **Purpose**: Centralized environment variable management
- **Features**:
  - Loads `.env` file
  - Validates required environment variables
  - Provides typed access to environment variables
  - Default values for development

#### `src/config/db.ts` - Database Connection
- **Purpose**: MongoDB connection management
- **Features**:
  - Connects to MongoDB using Mongoose
  - Handles connection events
  - Provides disconnect function
  - Error handling and logging

### Utility Files

#### `src/utils/logger.ts` - Logging System
- **Purpose**: Centralized logging with Winston
- **Features**:
  - Console and file logging
  - Different log levels (error, warn, info, debug)
  - Log formatting and rotation
  - Environment-based configuration

#### `src/utils/AppError.ts` - Custom Error Handling
- **Purpose**: Custom error class for application errors
- **Features**:
  - Structured error objects
  - Error factory functions
  - Operational vs programming errors
  - HTTP status code mapping

#### `src/utils/helpers.ts` - Utility Functions
- **Purpose**: Reusable utility functions
- **Features**:
  - String manipulation
  - Date formatting
  - Validation helpers
  - Crypto functions

### Middleware Files

#### `src/middlewares/error.middleware.ts` - Global Error Handler
- **Purpose**: Catches and handles all errors
- **Features**:
  - Converts errors to JSON responses
  - Logs errors with context
  - Handles different error types (MongoDB, JWT, etc.)
  - Development vs production error responses

#### `src/middlewares/validate.middleware.ts` - Request Validation
- **Purpose**: Validates request data using Joi
- **Features**:
  - Validates body, query, and params
  - Sanitizes input data
  - Returns detailed validation errors
  - Works with any Joi schema

#### `src/middlewares/auth.middleware.ts` - Authentication
- **Purpose**: Handles JWT authentication
- **Features**:
  - Verifies JWT tokens
  - Adds user info to request object
  - Role-based authorization
  - Optional authentication support

### Constants

#### `src/constants/error.constants.ts` - Error Codes & Messages
- **Purpose**: Centralized error definitions
- **Features**:
  - Error codes and messages
  - Consistent error handling
  - Type-safe error references
  - Categorized error types

## 🔄 API Call Flow

### Request Flow Architecture

```
HTTP Request
    ↓
Express App (app.ts)
    ↓
Route (routes/*.routes.ts)
    ↓
Validation Middleware (validate.middleware.ts)
    ↓
Controller (controllers/*.controller.ts)
    ↓
Service (services/*.service.ts)
    ↓
Model (models/*.model.ts)
    ↓
MongoDB Database
    ↓
Response (back through the chain)
    ↓
HTTP Response
```

### POST Request Example (Create Product)

```typescript
// 1. HTTP Request
POST /api/v1/products
Content-Type: application/json

{
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop",
  "productType": "electronics",
  "categoryId": "64a1b2c3d4e5f6789abcdef0",
  "stockQuantity": 50
}

// 2. Route Definition (src/routes/product.routes.ts)
router.post(
  '/',
  validateBody(createProductValidator),
  createProduct
);

// 3. Validation (src/middlewares/validate.middleware.ts)
// Uses src/validators/product.validator.ts
// Validates request body against Joi schema

// 4. Controller (src/controllers/product.controller.ts)
export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body; // Already validated
    const product = await ProductService.createProduct(productData);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error); // Passes to error middleware
  }
};

// 5. Service (src/services/product.service.ts)
export class ProductService {
  static async createProduct(productData: CreateProductData): Promise<IProduct> {
    try {
      const product = new Product(productData);
      await product.save();
      
      logger.info(`Product created successfully: ${product.name}`);
      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw error;
    }
  }
}

// 6. Model (src/models/product.model.ts)
// Mongoose schema handles validation and saves to MongoDB

// 7. HTTP Response
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789abcdef1",
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop",
    "productType": "electronics",
    "categoryId": "64a1b2c3d4e5f6789abcdef0",
    "stockQuantity": 50,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET Request Example (Get All Products)

```typescript
// 1. HTTP Request
GET /api/v1/products?page=1&limit=10&search=laptop&productType=electronics

// 2. Route Definition (src/routes/product.routes.ts)
router.get(
  '/',
  validateQuery(listProductValidator),
  getProducts
);

// 3. Validation (src/middlewares/validate.middleware.ts)
// Validates query parameters

// 4. Controller (src/controllers/product.controller.ts)
export const getProducts = async (req, res, next) => {
  try {
    const query = req.query; // Already validated
    const result = await ProductService.getAllProducts(query);
    
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result.products,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

// 5. Service (src/services/product.service.ts)
export class ProductService {
  static async getAllProducts(query: ProductQuery) {
    try {
      const { page = 1, limit = 10, search = '', productType } = query;
      
      // Build filter object
      const filter: any = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      if (productType) {
        filter.productType = productType;
      }
      
      // Execute queries
      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        Product.countDocuments(filter)
      ]);
      
      return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      logger.error('Error getting all products:', error);
      throw error;
    }
  }
}

// 6. HTTP Response
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789abcdef1",
      "name": "Laptop",
      "price": 999.99,
      "description": "High-performance laptop",
      "productType": "electronics",
      "categoryId": "64a1b2c3d4e5f6789abcdef0",
      "stockQuantity": 50,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

## 🛡️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "stack": "Error stack trace (development only)"
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `RESOURCE_NOT_FOUND` - Requested resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

## 🔧 Development Guidelines

### Adding New API Endpoints

1. **Create Model** (`src/models/`)
   - Define Mongoose schema
   - Export TypeScript interface
   - Add validation rules

2. **Create Validators** (`src/validators/`)
   - Define Joi schemas
   - Export multiple validators
   - Reuse sub-schemas for DRY principle

3. **Create Service** (`src/services/`)
   - Implement business logic
   - Handle database operations
   - Use logger for important events

4. **Create Controller** (`src/controllers/`)
   - Handle HTTP requests/responses
   - Call service methods
   - Use try-catch for error handling

5. **Create Routes** (`src/routes/`)
   - Define route paths
   - Apply validation middleware
   - Connect to controllers

6. **Update App** (`src/app.ts`)
   - Mount new routes
   - Add any new middleware

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use named exports (no default exports)
- Add JSDoc comments for functions
- Use async/await (no callbacks)
- Handle errors with try-catch
- Use Winston logger (no console.log)

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### Base URL

- **Development**: `http://localhost:3000`
- **API Base**: `http://localhost:3000/api/v1`

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

Ensure all required environment variables are set in production:

- `NODE_ENV=production`
- `PORT=3000`
- `MONGODB_URI=mongodb://your-production-db`
- `JWT_SECRET=your-production-secret`
- `CORS_ORIGIN=https://your-frontend-domain.com`

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
