# Algerian Government Documents Guide Platform

A community-powered web platform that provides step-by-step guides for obtaining government documents in Algeria. Users can browse verified procedures, contribute new guides, and suggest improvements to existing documentation.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)

---

## Features

- 📚 **Browse Documents**: Access comprehensive guides for government procedures
- 🔍 **Search & Filter**: Quickly find specific documents by name or category
- ✍️ **User Contributions**: Propose new document guides for community benefit
- 🔧 **Suggest Fixes**: Report and correct outdated or inaccurate information
- 👨‍💼 **Admin Dashboard**: Review, approve, or reject user submissions
- 🔐 **Secure Authentication**: Email verification and JWT-based auth
- 📱 **Responsive Design**: Optimized for desktop and mobile devices

---

## Tech Stack

### Frontend
- **React** 19.1.1 - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **SweetAlert2** - Beautiful modals and alerts

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - PostgreSQL database and file storage
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File upload middleware
- **Express Rate Limit** - API rate limiting

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v7.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

You'll also need:
- A **Supabase** account - [Sign up](https://supabase.com/)
- A **Gmail** account (for sending verification emails)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Majd-Baghdadi/SE-Project.git
cd SE-Project
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

---

## Configuration

### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** (SUPABASE_URL)
5. Copy the **service_role key** (SUPABASE_KEY)

### Setting Up Gmail for Emails

1. Enable **2-Factor Authentication** on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password
4. Use this password in `EMAIL_PASSWORD`

### Database Setup

In your Supabase dashboard, create the following tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  docid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  docname TEXT NOT NULL,
  doctype TEXT NOT NULL,
  docdescription TEXT,
  requireddocs TEXT[],
  steps TEXT[],
  docpicture TEXT,
  duration TEXT,
  relateddocs UUID[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Proposed documents table
CREATE TABLE proposed_documents (
  proposalid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userid UUID REFERENCES users(id),
  docname TEXT NOT NULL,
  doctype TEXT NOT NULL,
  docdescription TEXT,
  requireddocs TEXT[],
  steps TEXT[],
  docpicture TEXT,
  duration TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Proposed fixes table
CREATE TABLE proposed_fixes (
  fixid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userid UUID REFERENCES users(id),
  docid UUID REFERENCES documents(docid),
  issue TEXT,
  requireddocs TEXT[],
  steps TEXT[],
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

Create a storage bucket named `documents` in Supabase Storage and set it to public.

---

## Usage

### Starting the Application

**1. Start the Backend Server**

```bash
cd server
npm run dev
```

The server will start on `http://localhost:8000`

**2. Start the Frontend (in a new terminal)**

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

**3. Access the Application**

Open your browser and navigate to `http://localhost:5173`

### User Workflows

#### For Regular Users

**Sign Up:**
1. Click "Sign Up" in the navigation bar
2. Fill in your name, email, and password
3. Check your email for a verification link
4. Click the link to verify your account

**Browse Documents:**
1. Use the search bar on the home page
2. Or navigate to "Documents" to see all guides
3. Click on any document to view detailed steps

**Propose a New Document:**
1. Click the **+** button (bottom-right corner)
2. Select "Propose New Document"
3. Fill in the form with document details
4. Submit for admin review

**Suggest a Fix:**
1. Navigate to a document that needs correction
2. Click the **+** button
3. Select "Suggest a Fix"
4. Describe the issue and provide corrections
5. Submit for admin review

#### For Administrators

**Access Admin Dashboard:**
1. Log in with an admin account
2. Click "Admin Dashboard" in the navigation

**Review Proposals:**
1. Go to "Manage Proposed Documents"
2. Review each submission
3. Approve or reject with a reason

**Review Fixes:**
1. Go to "Manage Proposed Fixes"
2. Compare original vs. proposed changes
3. Approve or reject

**Update Documents:**
1. Go to "Update Documents"
2. Select a document to edit
3. Make changes and save

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | No |
| POST | `/api/auth/verifyEmail` | Verify email address | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/sendResetEmail` | Send password reset email | No |
| POST | `/api/auth/resetPassword` | Reset password | No |

### Documents

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/documents/` | Get all documents | No |
| GET | `/api/documents/:id` | Get document by ID | No |

### Proposals

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/propose/document` | Propose new document | Yes |
| POST | `/api/propose/fix` | Suggest fix | Yes |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/proposals` | Get all proposals | Admin |
| POST | `/api/admin/proposals/:id/approve` | Approve proposal | Admin |
| POST | `/api/admin/proposals/:id/reject` | Reject proposal | Admin |
| GET | `/api/admin/fixes` | Get all fixes | Admin |
| POST | `/api/admin/fixes/:id/approve` | Approve fix | Admin |
| POST | `/api/admin/fixes/:id/reject` | Reject fix | Admin |

---

## Project Structure

```
SE-Project/
├── client/                     # React frontend application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── assets/           # Images, fonts
│   │   ├── components/       # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── ...
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── DocumentDetails.jsx
│   │   │   ├── ProposeDocument.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Admin/        # Admin pages
│   │   ├── services/         # API service layer
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── documentService.js
│   │   │   └── adminService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js backend application
│   ├── config/                # Configuration files
│   │   └── supabase.js
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   ├── proposeController.js
│   │   └── adminController.js
│   ├── middlewares/           # Express middlewares
│   │   ├── authMiddleware.js
│   │   └── rateLimiter.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── proposeRoutes.js
│   │   └── adminRoutes.js
│   ├── services/              # Business logic
│   │   ├── authService.js
│   │   ├── documentService.js
│   │   └── emailService.js
│   ├── validations/           # Input validation
│   ├── .env                   # Environment variables
│   ├── server.js              # Entry point
│   └── package.json
│
└── README.md                   # This file
```

---

## Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/Majd-Baghdadi/SE-Project/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Your environment (OS, Node version, browser)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its benefits
3. Provide examples or mockups if possible

### Submitting Pull Requests

1. **Fork** the repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** and commit:
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request** with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots (if UI changes)

### Code Style

- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code structure
- Run linting before committing

---

## Troubleshooting

### Common Issues

#### Server won't start - "fetch failed" error

**Problem:** Cannot connect to Supabase

**Solution:**
- Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Check your internet connection
- Ensure Supabase project is active (not paused)

#### 429 Too Many Requests

**Problem:** Rate limiting triggered

**Solution:**
- Ensure `NODE_ENV=development` in `.env`
- Rate limiting is disabled in development mode
- Restart the server after changing `.env`

#### Email verification not working

**Problem:** Verification emails not sending

**Solution:**
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Use Gmail App Password, not your regular password
- Check spam folder for verification emails

#### 401 Unauthorized errors

**Problem:** Not authenticated

**Solution:**
- This is normal when not logged in
- Log in to get a valid session
- Ensure cookies are enabled in your browser

#### Images not uploading

**Problem:** File upload fails

**Solution:**
- Check Supabase storage bucket exists and is public
- Verify file size is under 5MB
- Ensure file format is JPEG, PNG, or WebP

#### Port already in use

**Problem:** `EADDRINUSE` error

**Solution:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Getting Help

If you encounter issues not listed here:
- Check [existing issues](https://github.com/Majd-Baghdadi/SE-Project/issues)
- Open a new issue with detailed information
- Contact: 

---

## License

This project is licensed under the **MIT License**.

### MIT License

```
Copyright (c) 2026 SE-Project Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**What this means:**
- ✅ You can use this software for any purpose
- ✅ You can modify the software
- ✅ You can distribute the software
- ✅ You can use it commercially
- ⚠️ You must include the license and copyright notice
- ⚠️ The software is provided "as-is" without warranty

---

## Authors

**SE-Project Team** - AI Engineering Students, ENSIA

### Team Members

- **Madjd Baghdadi** (Team Leader) - [madjd.baghdadi@ensia.edu.dz](mailto:madjd.baghdadi@ensia.edu.dz)
- **Amel Saidouni** - [amel.saidouni@ensia.edu.dz](mailto:amel.saidouni@ensia.edu.dz)
- **Aimene Boughenama** - [aimene.boughenama@ensia.edu.dz](mailto:aimene.boughenama@ensia.edu.dz)
- **Imene Tifour** - [imene.tifour@ensia.edu.dz](mailto:imene.tifour@ensia.edu.dz)
- **Dhiaaeddine Zeroual** - [dhiaaeddine.zeroual@ensia.edu.dz](mailto:dhiaaeddine.zeroual@ensia.edu.dz)

### Contact

For questions or collaboration, please contact the team leader: **madjd.baghdadi@ensia.edu.dz**

---

## Acknowledgments

- **Supabase** - For providing an excellent backend-as-a-service platform
- **React Team** - For the powerful UI library
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide Icons** - For the beautiful icon set
- **Vite** - For the lightning-fast build tool
- **All Contributors** - For making this platform better

### Special Thanks

- The Algerian community for inspiring this project
- Beta testers who provided valuable feedback
- Open-source contributors whose libraries made this possible

---

<div align="center">

**Made with ❤️ in Algeria**

Helping citizens navigate government procedures, one guide at a time.

[Report Bug](https://github.com/Majd-Baghdadi/SE-Project/issues) · [Request Feature](https://github.com/Majd-Baghdadi/SE-Project/issues)

</div>