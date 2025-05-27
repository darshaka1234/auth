# Authentication Methods Demo

This project demonstrates various authentication methods and implementations, providing a comprehensive reference for different authentication strategies in modern web applications.

## Features

The project includes implementations of the following authentication methods:

1. **Password-Based Authentication**

   - JWT-based authentication
   - Cookie-based session authentication
   - Secure password hashing with bcrypt
   - Refresh token mechanism
   - Protected routes and middleware

2. **WebAuthn (Passwordless)**

   - FIDO2/WebAuthn implementation
   - Biometric and security key support
   - Registration and authentication flows
   - Secure credential management

3. **Single Sign-On (SSO)**

   - Google OAuth integration
   - Session management
   - Protected routes
   - User profile handling

4. **Passwordless Authentication**
   - Magic link authentication
   - Email-based verification
   - Token-based authentication

## Project Structure

```
.
├── password-based/         # Password-based authentication implementation
│   ├── client/            # React frontend
│   └── server/            # Express backend
│       ├── server-jwt/    # JWT-based authentication server
│       └── server-cookie-base/  # Cookie-based session authentication server
├── webauthn/              # WebAuthn implementation
│   ├── client/            # React frontend
│   └── server/            # Express backend
├── sso/                   # SSO implementation
│   ├── client/            # React frontend
│   └── server/            # Express backend
└── passwordless/          # Passwordless authentication
    ├── client/            # React frontend
    └── server/            # Express backend
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Modern web browser with WebAuthn support (for WebAuthn demo)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd auth
```

### 2. Environment Setup

Each authentication method has its own environment requirements. Create a `.env` file in each server directory with the following variables:

#### Password-Based Authentication

```
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
MONGODB_URI=your_mongodb_uri
```

#### WebAuthn

```
RP_ID=localhost
ORIGIN=http://localhost:3000
MONGODB_URI=your_mongodb_uri
```

#### SSO

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_uri
```

### 3. Install Dependencies

For each authentication method:

```bash
# Install server dependencies
cd <auth-method>/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Running the Applications

Each authentication method can be run independently:

```bash
# Start the server
cd <auth-method>/server
npm run dev

# Start the client
cd ../client
npm start
```

## Security Considerations

- All implementations follow security best practices
- Passwords are properly hashed using bcrypt
- JWT tokens are securely stored and managed
- CSRF protection is implemented where applicable
- Rate limiting is implemented to prevent brute force attacks
- Secure session management
- Proper error handling and logging

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
