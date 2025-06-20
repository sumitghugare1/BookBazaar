# Deploying BookBazaar API to Render

This guide provides step-by-step instructions for deploying the BookBazaar API to Render.

## Prerequisites

1. A [Render account](https://render.com/)
2. Your BookBazaar API codebase in a Git repository (GitHub, GitLab, etc.)

## Steps to Deploy

### 1. Create a PostgreSQL Database on Render

1. Log in to your Render dashboard
2. Click on "New" and select "PostgreSQL"
3. Configure your database:
   - **Name**: bookbazaar-db (or your preferred name)
   - **Database**: bookbazaar
   - **User**: (Render will generate this)
   - **Region**: Choose the region closest to your users
   - **PostgreSQL Version**: 14 (or latest stable)
4. Click "Create Database"
5. Once created, note the internal and external database URLs

### 2. Create a Web Service

1. From your Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub/GitLab repository
3. Configure the web service:
   - **Name**: bookbazaar-api
   - **Environment**: Node
   - **Region**: Same as your database region
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or select a paid plan for production use)

### 3. Configure Environment Variables

In your web service settings, add the following environment variables:

- `NODE_ENV`: production
- `DATABASE_URL`: (Copy the External Database URL from your PostgreSQL service)
- `JWT_SECRET`: (Generate a strong secret key)
- `JWT_EXPIRE`: 30d
- `RAZORPAY_KEY_ID`: (Your Razorpay key)
- `RAZORPAY_KEY_SECRET`: (Your Razorpay secret)

### 4. Deploy Your Service

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Wait for the build to complete (this may take a few minutes)
4. Once deployed, you'll see a URL like `https://bookbazaar-api.onrender.com`

### 5. Test Your Deployment

1. Update your Postman collection's base_url to your Render URL
2. Test the API endpoints to ensure everything is working correctly

### 6. Create Admin User

To create an admin user on your deployed application:

1. Use the `/auth/register` endpoint to create a user
2. Connect to your Render PostgreSQL database using a PostgreSQL client:
   - You can use the Render dashboard's shell access
   - Or connect with a tool like pgAdmin using the external connection details
3. Run the following SQL query to promote a user to admin:
   ```sql
   UPDATE "Users" SET role='admin' WHERE email='your-admin-email@example.com';
   ```

### Troubleshooting

1. **Database Connection Issues**:
   - Check your DATABASE_URL environment variable
   - Verify that SSL is properly configured in your connection code

2. **Application Crashes**:
   - Check the logs in your Render dashboard
   - Ensure your code handles errors properly

3. **Performance Issues**:
   - Free tier has limitations and will spin down after inactivity
   - Consider upgrading to a paid plan for production use

4. **Cold Starts**:
   - Free tier services spin down after inactivity
   - The first request after inactivity may take longer to respond

### Maintenance

1. **Updating Your Application**:
   - Push changes to your connected repository
   - Render will automatically rebuild and deploy

2. **Database Backups**:
   - Render provides automatic daily backups for PostgreSQL databases
   - You can create manual backups from the database dashboard

3. **Monitoring**:
   - Use the Render dashboard to monitor your service
   - Consider implementing a more robust monitoring solution for production

# Using a Render PostgreSQL Database with Local Development

This guide provides step-by-step instructions for setting up a Render PostgreSQL database to use with your locally running BookBazaar API.

## Prerequisites

1. A [Render account](https://render.com/)
2. Your BookBazaar API codebase running locally

## Steps to Set Up the Database on Render

### 1. Create a PostgreSQL Database on Render

1. Log in to your Render dashboard
2. Click on "New" and select "PostgreSQL"
3. Configure your database:
   - **Name**: bookbazaar-db (or your preferred name)
   - **Database**: bookbazar
   - **User**: (Render will generate this)
   - **Region**: Choose the region closest to you
   - **PostgreSQL Version**: 14 (or latest stable)
4. Click "Create Database"
5. Once created, note the external database URL (it will look like `postgres://user:password@host/database`)

### 2. Configure Your Local Application to Use the Render Database

1. Open your `.env` file in the project's root directory
2. Comment out or remove the local database configuration:
   ```
   # DB_HOST=localhost
   # DB_USER=your_db_username
   # DB_PASS=your_db_password
   # DB_NAME=bookbazar
   # DB_PORT=5432
   ```
3. Add the Render database URL:
   ```
   DATABASE_URL=postgres://your_render_db_username:your_render_db_password@your_render_db_host/bookbazar
   ```
   (Replace this with your actual Render PostgreSQL URL)

### 3. Run Your Local Application

1. Start your application normally:
   ```
   npm run dev
   ```
2. The application will now connect to your Render PostgreSQL database instead of a local one

### 4. Create Admin User

To create an admin user:

1. Use the `/auth/register` endpoint to create a user
2. Connect to your Render PostgreSQL database using a PostgreSQL client:
   - You can use the Render dashboard's shell access
   - Or connect with a tool like pgAdmin using the external connection details
3. Run the following SQL query to promote a user to admin:
   ```sql
   UPDATE "Users" SET role='admin' WHERE email='your-admin-email@example.com';
   ```

### Connecting to the Database for Management

#### Using the Render Dashboard:

1. Go to your database in the Render dashboard
2. Click "Connect" → "Shell" to open a PostgreSQL shell
3. Run PostgreSQL commands directly, for example:
   ```sql
   \dt
   SELECT * FROM "Users";
   ```

#### Using a Database Client (e.g., pgAdmin, DBeaver):

1. Get the connection details from your Render dashboard
2. Configure your client with:
   - Host: Your Render PostgreSQL hostname
   - Port: Your Render PostgreSQL port (usually 5432)
   - Database: bookbazar
   - Username: Your Render PostgreSQL username
   - Password: Your Render PostgreSQL password
   - SSL Mode: Require

### Troubleshooting

1. **Database Connection Issues**:
   - Verify your DATABASE_URL is correct
   - Ensure your application is properly configured to use SSL with Render
   - Check for network issues or IP restrictions

2. **Slow Connections**:
   - Free tier databases on Render might have higher latency
   - For development with many queries, consider a paid plan or local development database

3. **Database Limits**:
   - Be aware of Render's free tier limits (storage, connections, etc.)
   - Monitor your database usage in the Render dashboard
