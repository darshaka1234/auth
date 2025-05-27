# Passwordless Authentication Demo

This project demonstrates passwordless authentication using magic links. It consists of a Next.js client and an Express server.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas account)
- Gmail account (for sending magic links)

## Setup

### Server Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:

   ```
   MONGODB_URI=mongodb://localhost:27017/passwordless-auth
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-app-password
   CLIENT_URL=http://localhost:3000
   ```

   Note: For Gmail, you'll need to use an App Password. You can generate one in your Google Account settings under Security > 2-Step Verification > App passwords.

4. Start the server:
   ```bash
   node src/index.js
   ```

### Client Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open http://localhost:3000 in your browser
2. Enter your name and email address
3. Click "Send Magic Link"
4. Check your email for the magic link
5. Click the link to log in
6. You'll be redirected to the dashboard

## Features

- Passwordless authentication using magic links
- Secure JWT-based session management
- MongoDB user storage
- Protected dashboard route
- Responsive UI with Tailwind CSS

## Security Considerations

- Magic links expire after 15 minutes
- Session tokens expire after 7 days
- All sensitive data is stored securely in MongoDB
- HTTPS is recommended for production use
