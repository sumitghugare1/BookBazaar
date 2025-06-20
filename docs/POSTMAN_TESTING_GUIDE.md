# BookBazaar API - Postman Testing Guide

This guide will walk you through testing all the endpoints of your BookBazaar API using the included Postman collection.

## 1. Setting Up Postman

### Import the Collection
1. Open Postman
2. Click on "Import" in the top left corner
3. Select "File" and browse to `c:\Users\SUMIT\Desktop\bookbazar\postman\BookBazaar_API.json`
4. Click "Import"

### Create an Environment
1. Click on the gear icon (⚙️) in the top right corner
2. Click "Add" to create a new environment
3. Name it "BookBazaar Local" (or "BookBazaar Production" if using Render)
4. Add the following variables:
   - `base_url`: `http://localhost:5000` (or your Render URL)
   - `auth_token`: Leave empty for now
   - `api_key`: Leave empty for now
   - Other variables like `book_id`, `order_id`, etc., will be filled in as we test

5. Click "Save"
6. Select your new environment from the dropdown in the top right corner

## 2. Testing Authentication Endpoints

### Register a User
1. In the Postman collection, expand "Authentication" folder
2. Click on "Register"
3. In the request body, modify the JSON with your test user details:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```
4. Click "Send"
5. You should receive a 201 response with user details and a JWT token
6. Copy the token value from the response

### Set the JWT Token
1. Click on your environment in the top right corner and select "Edit"
2. Set the `auth_token` variable with the token you copied
3. Click "Update"

### Login
1. Click on "Login" in the Authentication folder
2. Update the request body with your registered email and password
3. Click "Send"
4. Verify that you receive a 200 response with a token
5. Update your `auth_token` environment variable with this new token

### Generate API Key
1. Click on "Generate API Key" in the Authentication folder
2. Verify that the Authorization header is set to `Bearer {{auth_token}}`
3. Click "Send"
4. You should receive a 201 response with your new API key
5. Copy the API key value from the response
6. Update your `api_key` environment variable with this key

### Get User Profile
1. Click on "Get User Profile"
2. Click "Send"
3. Verify that you receive a 200 response with your user details and API keys

## 3. Testing Book Endpoints

### First, Create a Book (Admin Only)
1. You need admin privileges for this. If your test user isn't an admin, update their role in the database:
   ```sql
   UPDATE "Users" SET role='admin' WHERE email='test@example.com';
   ```
2. In the Postman collection, expand the "Books" folder
3. Click on "Add New Book (Admin)"
4. Verify that both headers are properly set:
   - Authorization: `Bearer {{auth_token}}`
5. Update the request body with book details:
   ```json
   {
     "title": "The Great Gatsby",
     "author": "F. Scott Fitzgerald",
     "description": "A classic novel about the American Dream.",
     "isbn": "9780743273565",
     "price": 12.99,
     "genre": "Fiction",
     "publisher": "Scribner",
     "publishedDate": "2004-09-30",
     "stockQuantity": 50,
     "imageUrl": "https://example.com/gatsby.jpg"
   }
   ```
6. Click "Send"
7. You should receive a 201 response with the created book
8. Copy the book's `id` value from the response
9. Update your `book_id` environment variable with this ID

### Get All Books
1. Click on "Get All Books"
2. Verify the "X-API-Key" header is set to `{{api_key}}`
3. Click "Send"
4. You should receive a 200 response with a list of books

### Get Book by ID
1. Click on "Get Book by ID"
2. Verify the "X-API-Key" header is set
3. Click "Send"
4. You should receive a 200 response with details of the specific book

### Update Book
1. Click on "Update Book (Admin)"
2. Verify the Authorization header is set
3. Update the request body with the fields you want to change:
   ```json
   {
     "price": 14.99,
     "stockQuantity": 75
   }
   ```
4. Click "Send"
5. You should receive a 200 response with the updated book details

## 4. Testing Reviews

### Add a Review
1. Expand the "Reviews" folder
2. Click on "Add Review"
3. Verify the Authorization header is set
4. Update the request body:
   ```json
   {
     "rating": 5,
     "comment": "This book was amazing! Highly recommend it."
   }
   ```
5. Click "Send"
6. You should receive a 201 response with your review
7. Copy the review's `id` value from the response
8. Update your `review_id` environment variable with this ID

### Get Book Reviews
1. Click on "Get Book Reviews"
2. Verify the "X-API-Key" header is set
3. Click "Send"
4. You should receive a 200 response with a list of reviews for the book

## 5. Testing Cart Functionality

### Add to Cart
1. Expand the "Cart" folder
2. Click on "Add to Cart"
3. Verify the Authorization header is set
4. Update the request body:
   ```json
   {
     "bookId": "{{book_id}}",
     "quantity": 2
   }
   ```
5. Click "Send"
6. You should receive a 200 response with cart item details
7. Copy the cart item's `id` value
8. Update your `cart_item_id` environment variable with this ID

### Get Cart
1. Click on "Get Cart"
2. Verify the Authorization header is set
3. Click "Send"
4. You should receive a 200 response with your cart contents and total

### Update Cart Item
1. Click on "Update Cart Item"
2. Verify the Authorization header is set
3. Update the request body:
   ```json
   {
     "quantity": 3
   }
   ```
4. Click "Send"
5. You should receive a 200 response with updated cart item

## 6. Testing Orders

### Place Order
1. Expand the "Orders" folder
2. Click on "Place Order"
3. Verify that both headers are set:
   - Authorization: `Bearer {{auth_token}}`
   - X-API-Key: `{{api_key}}`
4. Update the request body:
   ```json
   {
     "items": [
       {
         "bookId": "{{book_id}}",
         "quantity": 2
       }
     ],
     "shippingAddress": "123 Main St, Anytown, USA",
     "contactNumber": "+1234567890"
   }
   ```
5. Click "Send"
6. You should receive a 201 response with order details
7. Copy the order's `id` value
8. Update your `order_id` environment variable with this ID

### Get All Orders
1. Click on "Get All Orders"
2. Verify both headers are set
3. Click "Send"
4. You should receive a 200 response with a list of your orders

### Get Order by ID
1. Click on "Get Order by ID"
2. Verify both headers are set
3. Click "Send"
4. You should receive a 200 response with details of the specific order

## 7. Testing Payments

### Create Payment
1. Expand the "Payments" folder
2. Click on "Create Payment"
3. Verify both headers are set
4. Update the request body:
   ```json
   {
     "orderId": "{{order_id}}"
   }
   ```
5. Click "Send"
6. You should receive a 200 response with payment details
7. Copy the payment's `id` value
8. Update a new environment variable called `razorpay_order_id` with this ID

### Verify Payment (Mock)
1. Click on "Verify Payment"
2. Verify both headers are set
3. Update the request body:
   ```json
   {
     "razorpay_order_id": "{{razorpay_order_id}}",
     "razorpay_payment_id": "pay_mock123456789",
     "razorpay_signature": "mock_signature_for_testing"
   }
   ```

   > Note: In a real scenario, these values would come from Razorpay's frontend callback. For testing, we're using mock values.

4. You'll receive an error as the signature verification will fail, which is expected in this mock testing scenario.

## 8. Testing Negative Scenarios

For thorough testing, try these negative scenarios:

1. **Invalid Authentication**: Try accessing protected routes without a token or API key
2. **Unauthorized Access**: Try accessing admin routes with a non-admin user
3. **Invalid Data**: Submit incomplete or invalid data in request bodies
4. **Resource Not Found**: Try accessing non-existent resources (books, orders, etc.)
5. **Insufficient Stock**: Try ordering more books than available in stock

## 9. Collection Runner

To run all tests at once:

1. Click on the "..." next to the collection name
2. Select "Run collection"
3. Select which requests to run
4. Click "Run BookBazaar API"

This will execute all selected requests in sequence, helping you verify the entire API flow.

## Troubleshooting Common Issues

### 404 Not Found for Register Endpoint

If you're encountering a 404 Not Found error when trying to register a user, try the following solutions:

1. **Check the server status**: Ensure your server is running properly. Look for the "Server running on port 5000" message in your console.

2. **Verify API route paths**: Make sure you're using the correct endpoint URL. The full URL should be:
   ```
   http://localhost:5000/auth/register
   ```
   Double-check for any typos in the URL path.

3. **Verify route imports in server.js**: Ensure that authRoutes is properly imported and configured in your server.js file:
   ```javascript
   const authRoutes = require('./routes/authRoutes');
   // ...
   app.use('/auth', authRoutes);
   ```

4. **Check file structure**: Confirm that the following files exist in the correct locations:
   - `routes/authRoutes.js`
   - `controllers/authController.js`
   - `models/User.js`

5. **Inspect route definitions**: In your authRoutes.js file, verify that the register route is properly defined:
   ```javascript
   router.post('/register', [...validation], register);
   ```

6. **Check for middleware issues**: If you're using middleware that might intercept requests, ensure it's properly forwarding requests to the next handler.

7. **Restart the server**: Sometimes simply restarting the server can resolve route registration issues.

8. **Try a different endpoint**: To isolate the issue, try accessing a different endpoint like the root endpoint (http://localhost:5000/) to verify the server is responding to requests.

9. **Check server logs**: Look for any error messages in your server console that might indicate why the route isn't being recognized.

### Cannot POST //auth/login

If you're encountering a "Cannot POST //auth/login" error, the issue is likely with the URL format - specifically the double slash in the path. Here's how to fix it:

1. **Check your environment variable setup**:
   - Make sure your `base_url` environment variable is correctly set to `http://localhost:5000` (without a trailing slash)
   - If there's a trailing slash in your base_url, remove it

2. **Check the request URL in Postman**:
   - Click on the "Login" request in the Authentication folder
   - Look at the URL field at the top of the request
   - It should be: `{{base_url}}/auth/login` (make sure there's only one slash after the variable)
   - If you see `{{base_url}}//auth/login` (with double slashes), edit the request URL to fix it

3. **Try a direct URL**: 
   - Temporarily replace `{{base_url}}/auth/login` with the direct URL `http://localhost:5000/auth/login`
   - If this works, the issue is with your environment variable setup

4. **Check collection settings**:
   - Right-click on the collection and select "Edit"
   - Go to the "Variables" tab
   - Check if there are any collection-level variables that might be interfering

5. **Verify the server is running** and the login route is properly defined in your `authRoutes.js` file

6. **Restart Postman**: Sometimes Postman caches environment variables or has issues with variable substitution. Restarting the application can help.

7. **Update Postman** to the latest version if you're using an older version

### "Not authorized to access this route" Error

If you receive a "Not authorized to access this route" error when accessing `http://localhost:5000/auth/api-key` or other protected endpoints, follow these steps:

1. **Check your JWT token**:
   - Ensure you have a valid JWT token from the register or login response
   - Verify that the token hasn't expired (JWT tokens typically expire after the time specified in JWT_EXPIRE)

2. **Verify Authorization header format**:
   - The header must be exactly: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual token)
   - Common mistakes include:
     - Missing the word "Bearer"
     - Extra spaces before or after "Bearer"
     - Not using the full token string
     - Adding quotes around the token

3. **Re-login to get a fresh token**:
   - Use the login endpoint to get a new token
   - Immediately update your environment variable with the new token
   - Try your request again

4. **Inspect token in JWT debugger**:
   - Go to [jwt.io](https://jwt.io/)
   - Paste your token to verify it's properly formatted and hasn't expired

5. **Check server JWT configuration**:
   - Verify the JWT_SECRET in your .env file matches what was used to create the tokens
   - Ensure the JWT_EXPIRE value is reasonable (e.g., "30d" for 30 days)

6. **Use a direct token (temporary test)**:
   - Instead of using the {{auth_token}} variable, try pasting the actual token directly in the Authorization header
   - This helps determine if the issue is with Postman variable substitution

7. **Server logs**:
   - Check your server console for any JWT verification errors
   - Look for messages like "invalid signature" or "jwt expired"
