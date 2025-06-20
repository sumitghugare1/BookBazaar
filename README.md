# BookBazaar API

A complete REST API for an online bookstore that allows users to browse, purchase, and review books.

## Features

- User authentication with JWT
- API key generation for accessing protected resources
- Full CRUD operations for books, reviews, and orders
- Admin-only access for certain book operations
- Shopping cart functionality
- Payment integration with Razorpay
- Search, filtering, and pagination for book listings
- Email notifications for orders and payments

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database (local or Render-hosted)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:

   **Option 1: Using a local PostgreSQL database:**
   ```
   PORT=5000
   NODE_ENV=development
   
   # Database settings
   DB_HOST=localhost
   DB_USER=your_db_username
   DB_PASS=your_db_password
   DB_NAME=bookbazar
   DB_PORT=5432
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   
   # Razorpay (for payment integration)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

   **Option 2: Using a Render-hosted PostgreSQL database:**
   ```
   PORT=5000
   NODE_ENV=development
   
   # Database settings - using Render PostgreSQL
   DATABASE_URL=postgres://your_render_db_username:your_render_db_password@your_render_db_host/bookbazar
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   
   # Razorpay (for payment integration)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

## Using Render PostgreSQL Database

This project is configured to work with either a local PostgreSQL database or a Render-hosted PostgreSQL database while running the application locally.

### Setting up a PostgreSQL Database on Render

1. Create a Render account at [render.com](https://render.com)
2. Create a new PostgreSQL database:
   - Go to your Render dashboard
   - Click "New" and select "PostgreSQL"
   - Configure your database:
     - Name: bookbazaar-db (or your preferred name)
     - Database: bookbazar
     - User: (Render will generate this)
     - Region: Choose the region closest to you
   - Click "Create Database"
3. Once created, copy the "External Database URL" from the Render dashboard
4. Add this URL as `DATABASE_URL` in your `.env` file

### Connecting to Render PostgreSQL Database

The application is configured to automatically detect and use the `DATABASE_URL` environment variable when it's present, with the necessary SSL configuration for Render.

## Deployment on Render

### Setting up the Web Service

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name:** bookbazaar-api (or your preferred name)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

### Environment Variables

Add the following environment variables in Render dashboard:

- `NODE_ENV`: production
- `JWT_SECRET`: (your secure JWT secret)
- `JWT_EXPIRE`: 30d
- `RAZORPAY_KEY_ID`: (your Razorpay key)
- `RAZORPAY_KEY_SECRET`: (your Razorpay secret)

### Database Setup

1. Create a PostgreSQL database in Render
2. Render will automatically add the `DATABASE_URL` environment variable to your web service

### Testing Your Deployment

After deployment, your API will be available at your Render URL (e.g., `https://bookbazaar-api.onrender.com`).

Update your Postman collection's `base_url` variable to point to your Render URL instead of localhost.

## API Documentation

### Authentication Routes

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/api-key` - Generate API key (requires authentication)
- `GET /auth/me` - Get current user profile (requires authentication)

### Book Routes

- `GET /books` - Get all books (requires API key)
- `GET /books/:id` - Get a book by ID (requires API key)
- `POST /books` - Add a new book (admin only)
- `PUT /books/:id` - Update a book (admin only)
- `DELETE /books/:id` - Delete a book (admin only)

### Review Routes

- `POST /books/:bookId/reviews` - Add a review to a book (requires authentication)
- `GET /books/:bookId/reviews` - Get all reviews for a book (requires API key)
- `DELETE /reviews/:id` - Delete a review (owner or admin only)

### Order Routes

- `POST /orders` - Create a new order (requires authentication and API key)
- `GET /orders` - Get all orders for current user (requires authentication and API key)
- `GET /orders/:id` - Get order details (requires authentication and API key)

### Payment Routes

- `POST /payments/create` - Create a payment (requires authentication and API key)
- `POST /payments/verify` - Verify a payment (requires authentication and API key)

### Cart Routes

- `GET /cart` - Get user's cart (requires authentication)
- `POST /cart` - Add item to cart (requires authentication)
- `PUT /cart/:id` - Update cart item quantity (requires authentication)
- `DELETE /cart/:id` - Remove item from cart (requires authentication)
- `DELETE /cart` - Clear cart (requires authentication)

## Testing

A complete Postman collection is included in the `postman` directory for testing all API endpoints.

## License

This project is licensed under the MIT License.
