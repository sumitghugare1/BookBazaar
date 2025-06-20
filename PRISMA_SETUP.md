# Prisma Setup for BookBazaar

This guide will help you set up Prisma for database visualization and management alongside the existing Sequelize ORM.

## Prerequisites

- The BookBazaar API project is already set up with Sequelize
- PostgreSQL database is configured and running

## Step 1: Install Prisma Dependencies

The project is already configured with Prisma dependencies in package.json:
- `@prisma/client` - Prisma client for database access
- `prisma` - Prisma CLI tools (devDependency)

Run this command to install these dependencies:

```bash
npm install
```

## Step 2: Initialize Prisma and Generate Client

Run the following commands in sequence:

```bash
# Initialize Prisma with your database connection
npm run prisma:init

# Pull the database schema from your existing database
npm run prisma:pull

# Generate the Prisma client
npm run prisma:generate
```

### Note on prisma:init

After running `prisma:init`, you'll need to:
1. Open the generated `prisma/schema.prisma` file
2. Ensure the `datasource db` block is correctly configured:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 3: View Your Database with Prisma Studio

To view and manage your database, run:

```bash
npm run prisma:studio
```

This will open Prisma Studio in your browser at [http://localhost:5555](http://localhost:5555)

## Using Both Sequelize and Prisma

- The main application continues to use Sequelize for all database operations
- Prisma is used primarily for database visualization and management
- The schema.prisma file defines the database structure for Prisma
- Make sure to regenerate the Prisma client after database schema changes:

```bash
npm run prisma:pull && npm run prisma:generate
```

## Troubleshooting

If you encounter issues with the DATABASE_URL:

1. Check your `.env` file to ensure DATABASE_URL is correctly set
2. For local development, it should look like: 
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/bookbazar
   ```
3. For Render or other hosted databases, use the connection string they provide

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Studio Guide](https://www.prisma.io/docs/concepts/components/prisma-studio)
