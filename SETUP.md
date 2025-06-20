# BookBazaar API - Setup Guide

This document provides a comprehensive guide to set up and run the BookBazaar API project.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)
- Git (optional, for version control)

## Setup Steps

### 1. Clone or Download the Project

If using Git:
```bash
git clone <repository-url>
cd bookbazar
```

Or simply extract the project files to your desired location.

### 2. Install Dependencies

Navigate to the project directory and install the required npm packages:

```bash
npm install
```

### 3. Set Up the Database

You have two options for setting up the database:

#### Option 1: Local PostgreSQL Database

1. Create a PostgreSQL database for the project:

```bash
psql -U postgres
CREATE DATABASE bookbazar;
\q
```

2. The application will create the necessary tables automatically when it first runs.

#### Option 2: Render PostgreSQL Database

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

### 4. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

**For Local PostgreSQL:**

