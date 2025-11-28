# 🚀 Complete Backend Architecture Explanation

## 📦 Framework & Technology Stack

### **Backend Framework: Express.js (Node.js)**
- **Express.js**: Minimal and flexible Node.js web application framework
- **Version**: 4.18.2
- **Why Express?**: Fast, unopinionated, minimalist web framework for Node.js

### **Database: Supabase (PostgreSQL)**
- **Supabase**: Open-source Firebase alternative
- **Database Type**: PostgreSQL (relational database)
- **Location**: Cloud-hosted (Supabase servers)
- **Client Library**: @supabase/supabase-js v2.39.0

---

## 🏗️ Backend Architecture Pattern: MVC + Service Layer

Your backend follows a **layered architecture**:

```
┌─────────────────────────────────────────────────┐
│              CLIENT (React Frontend)            │
│         http://localhost:5173                   │
└────────────────┬────────────────────────────────┘
                 │ HTTP Requests
                 ↓
┌─────────────────────────────────────────────────┐
│         SERVER (Express Backend)                │
│         http://localhost:8000                   │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  1. ROUTES (documentRoutes.js)          │  │
│  │     - URL mapping                        │  │
│  │     - GET /api/documents/               │  │
│  │     - GET /api/documents/:id            │  │
│  └──────────┬───────────────────────────────┘  │
│             ↓                                   │
│  ┌──────────────────────────────────────────┐  │
│  │  2. CONTROLLERS (documentController.js) │  │
│  │     - Request handling                   │  │
│  │     - Response formatting               │  │
│  │     - Error handling                    │  │
│  └──────────┬───────────────────────────────┘  │
│             ↓                                   │
│  ┌──────────────────────────────────────────┐  │
│  │  3. SERVICES (documentService.js)       │  │
│  │     - Business logic                     │  │
│  │     - Database queries                   │  │
│  │     - Data transformation               │  │
│  └──────────┬───────────────────────────────┘  │
│             ↓                                   │
└─────────────┼───────────────────────────────────┘
              │ Supabase Client
              ↓
┌─────────────────────────────────────────────────┐
│         DATABASE (Supabase/PostgreSQL)          │
│         Tables: documents, users, fixes, etc.   │
└─────────────────────────────────────────────────┘
```

---

## 📂 Folder Structure Explained

```
server/
├── server.js                 # 🚪 Entry point - starts the server
├── package.json             # 📦 Dependencies list
│
├── config/                  # ⚙️ Configuration files
│   └── supabase.js         # Database connection setup
│
├── routes/                  # 🛣️ URL routing (endpoint definitions)
│   ├── documentRoutes.js   # Document endpoints
│   ├── authRoutes.js       # Authentication endpoints
│   ├── userRoutes.js       # User management endpoints
│   ├── adminRoutes.js      # Admin panel endpoints
│   ├── fixRoutes.js        # Issue reporting endpoints
│   └── proposedDocumentRoutes.js # Document proposals
│
├── controllers/             # 🎮 Request handlers
│   ├── documentController.js
│   ├── authController.js
│   └── ...
│
├── services/               # 💼 Business logic & database queries
│   ├── documentService.js
│   ├── authService.js
│   └── ...
│
├── middlewares/            # 🔒 Request interceptors
│   ├── authMiddleware.js  # Verify user authentication
│   └── errorHandler.js    # Centralized error handling
│
├── validations/           # ✅ Input validation rules
│   ├── documentValidation.js
│   └── authValidation.js
│
└── utils/                 # 🛠️ Helper functions
    ├── generateToken.js   # JWT token creation
    └── formatResponse.js  # Response formatting
```

---

## 🔍 Deep Dive: How Each Layer Works

### 1️⃣ **SERVER.JS - The Entry Point**

```javascript
require('dotenv').config();           // Load environment variables
const express = require('express');   // Import Express framework
const app = express();                // Create Express app instance

app.use(express.json());              // Parse JSON request bodies
app.use("/api/documents", documentRoutes);  // Mount document routes

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
```

**What it does:**
- Initializes Express application
- Sets up middleware (JSON parsing)
- Connects all routes
- Starts listening on port 8000 (or 4000)

---

### 2️⃣ **ROUTES - URL Mapping**

**File**: `routes/documentRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");

// Define endpoints
router.get("/", documentController.getDocuments);
router.get("/:id", documentController.getDocumentDetails);

module.exports = router;
```

**What it does:**
- Maps URLs to controller functions
- `/api/documents/` → `getDocuments()`
- `/api/documents/123` → `getDocumentDetails(123)`

**Technical Term**: **Routing** - The process of determining how an application responds to a client request to a particular endpoint

---

### 3️⃣ **CONTROLLERS - Request Handlers**

**File**: `controllers/documentController.js`

```javascript
const Document = require("../services/documentService");

async function getDocuments(req, res) {
    try {
        // Call service layer to get data
        const {data, error} = await Document.getDocuments();
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        // Send successful response
        res.status(200).json({ documents: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
```

**What it does:**
- Receives HTTP requests (req)
- Calls service layer to get data
- Formats and sends HTTP responses (res)
- Handles errors and status codes

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (client error)
- `404` - Not Found
- `500` - Internal Server Error

**Technical Term**: **Controller** - Handles incoming requests, processes them (often by invoking model methods), and returns responses to the client

---

### 4️⃣ **SERVICES - Business Logic & Database**

**File**: `services/documentService.js`

```javascript
const supabase = require("../config/supabase");

async function getDocuments() {
    // Query database using Supabase
    return await supabase
        .from("documents")              // Table name
        .select("docid,docname,docpicture");  // Columns to fetch
}

async function getDocumentDetails(id) {
    return await supabase
        .from("documents")
        .select("*")                    // All columns
        .eq("docid", id)                // WHERE docid = id
        .single();                      // Return single row
}
```

**What it does:**
- Contains business logic
- Performs database queries
- Returns raw data to controllers
- No HTTP knowledge (doesn't know about req/res)

**Technical Term**: **Service Layer** - Encapsulates business logic and data access, separating concerns from controllers

---

### 5️⃣ **DATABASE - Supabase Configuration**

**File**: `config/supabase.js`

```javascript
const {createClient} = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,    // Your Supabase project URL
    process.env.SUPABASE_KEY     // Your API key
);

module.exports = supabase;
```

**What it does:**
- Creates connection to Supabase database
- Uses environment variables for security
- Exports client for use in services

**Database Location:**
- **Physical Location**: Supabase cloud servers (AWS)
- **Access Method**: REST API over HTTPS
- **Connection**: Established via Supabase client library

---

## 🌐 What Does "Calling an API" Mean?

### **API (Application Programming Interface)**

An API is a contract between two software systems to communicate:

```
Frontend (React)  ←→ HTTP Request/Response ←→  Backend (Express)
```

### **The Complete API Call Flow:**

#### **Step 1: Frontend Makes Request**
```javascript
// In React component (Home.jsx)
fetch('http://localhost:8000/api/documents/')
```

#### **Step 2: HTTP Request Travels Over Network**
```
HTTP GET Request
↓
URL: http://localhost:8000/api/documents/
Method: GET
Headers: {
  Content-Type: application/json
}
```

#### **Step 3: Express Server Receives Request**
```javascript
// server.js routes the request
app.use("/api/documents", documentRoutes);
```

#### **Step 4: Route Matches & Controller Executes**
```javascript
// routes/documentRoutes.js
router.get("/", documentController.getDocuments);
```

#### **Step 5: Controller Calls Service**
```javascript
// controllers/documentController.js
const {data, error} = await Document.getDocuments();
```

#### **Step 6: Service Queries Database**
```javascript
// services/documentService.js
return await supabase.from("documents").select("*");
```

#### **Step 7: Database Returns Data**
```sql
-- PostgreSQL query executed
SELECT docid, docname, docpicture FROM documents;
```

#### **Step 8: Service Returns to Controller**
```javascript
// Returns: {data: [...], error: null}
```

#### **Step 9: Controller Formats Response**
```javascript
res.status(200).json({ documents: data });
```

#### **Step 10: HTTP Response Travels Back**
```
HTTP Response
↓
Status: 200 OK
Body: {
  "documents": [
    {"docid": "123", "docname": "Passport", ...}
  ]
}
```

#### **Step 11: Frontend Receives & Uses Data**
```javascript
fetch('http://localhost:8000/api/documents/')
  .then(response => response.json())
  .then(data => {
    console.log(data.documents); // Use the data!
  });
```

---

## 🔐 Other Backend Components

### **MIDDLEWARES**

**What they are:** Functions that run BEFORE your controller

```javascript
// authMiddleware.js
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    
    // Verify token...
    next(); // Pass to next middleware or controller
}
```

**Use cases:**
- Authentication (verify user is logged in)
- Logging (record all requests)
- CORS (enable cross-origin requests)
- Input validation

---

### **VALIDATIONS**

**What they are:** Rules to check if request data is correct

```javascript
// documentValidation.js
const { body } = require('express-validator');

const createDocumentValidation = [
    body('docname').notEmpty().withMessage('Document name required'),
    body('doctype').isString(),
    body('steps').isArray().withMessage('Steps must be an array')
];
```

**Prevents:** Bad data from reaching your database

---

### **UTILS (Utilities)**

**What they are:** Helper functions used across the app

```javascript
// generateToken.js
const jwt = require('jsonwebtoken');

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
}
```

---

## 📊 Database Structure (Supabase/PostgreSQL)

### **Where is the database?**
- **Hosted on**: Supabase cloud infrastructure (AWS)
- **Type**: PostgreSQL (relational database)
- **Access**: Via Supabase REST API

### **Database Tables (Based on your code):**

```sql
-- documents table
CREATE TABLE documents (
    docid UUID PRIMARY KEY,
    docname TEXT,
    docpicture TEXT,
    doctype TEXT,
    steps TEXT[],         -- Array of strings
    docprice INTEGER,
    duration INTEGER,
    relateddocs UUID[]    -- Array of related document IDs
);

-- Other tables (inferred from routes)
CREATE TABLE users (...);
CREATE TABLE fixes (...);
CREATE TABLE proposed_documents (...);
```

---

## 🔄 Request-Response Cycle Summary

```
1. User clicks button in React app
   ↓
2. React makes HTTP request (fetch/axios)
   ↓
3. Request travels over internet to server
   ↓
4. Express server receives request
   ↓
5. Middleware runs (auth, validation, etc.)
   ↓
6. Route matches URL to controller function
   ↓
7. Controller function executes
   ↓
8. Controller calls service function
   ↓
9. Service queries database via Supabase
   ↓
10. Database returns data
    ↓
11. Service returns data to controller
    ↓
12. Controller formats JSON response
    ↓
13. Response travels back to React app
    ↓
14. React component updates UI with data
```

---

## 🎯 Key Technical Terms Explained

### **REST API (REpresentational State Transfer)**
- Architectural style for APIs
- Uses HTTP methods: GET, POST, PUT, DELETE
- Stateless communication
- Your backend IS a REST API

### **HTTP Methods:**
- **GET**: Retrieve data (read)
- **POST**: Create new data
- **PUT/PATCH**: Update existing data
- **DELETE**: Remove data

### **JSON (JavaScript Object Notation)**
- Data format for API communication
- Human-readable text format
- Example: `{"name": "Passport", "price": 6000}`

### **Async/Await**
- Modern JavaScript way to handle asynchronous operations
- Waits for database queries to complete
- Prevents blocking the server

### **Environment Variables**
- Sensitive configuration stored in `.env` file
- Not committed to Git (security)
- Example: `SUPABASE_URL=https://xxx.supabase.co`

### **CORS (Cross-Origin Resource Sharing)**
- Security feature
- Allows frontend (port 5173) to talk to backend (port 8000)
- Different "origins" = different ports/domains

---

## 🔌 How Frontend Connects to Backend

### **Method 1: Fetch API (Native JavaScript)**
```javascript
fetch('http://localhost:8000/api/documents/')
  .then(response => response.json())
  .then(data => console.log(data));
```

### **Method 2: Axios (Popular library)**
```javascript
import axios from 'axios';

const response = await axios.get('http://localhost:8000/api/documents/');
console.log(response.data);
```

### **Method 3: Service Layer (Best Practice)**
```javascript
// services/documentService.js
export async function fetchAllDocuments() {
    const response = await fetch('http://localhost:8000/api/documents/');
    return response.json();
}

// In component
import { fetchAllDocuments } from '../services/documentService';
const data = await fetchAllDocuments();
```

---

## 🚀 What Your Teammate Built

### **✅ Complete Features:**

1. **Document Management System**
   - Fetch all documents
   - Get document details
   - Related documents support

2. **Authentication System**
   - User registration/login
   - JWT token-based auth
   - Protected routes

3. **Admin Features**
   - Document management
   - User management
   - Content moderation

4. **Community Features**
   - Propose new documents
   - Report issues/fixes
   - User contributions

### **📦 Database Tables:**
- `documents` - Official procedures
- `users` - User accounts
- `fixes` - Reported issues
- `proposed_documents` - Community proposals

---

## 🎓 Summary: The Big Picture

Your backend is a **REST API** built with **Express.js** that:
1. Listens for HTTP requests from your React frontend
2. Routes requests to appropriate controllers
3. Controllers call services to get data
4. Services query **Supabase (PostgreSQL)** database
5. Data flows back up through services → controllers → frontend
6. Frontend displays data to users

**It's like a waiter in a restaurant:**
- Frontend = Customer (orders food)
- Routes = Menu (lists available dishes)
- Controllers = Waiter (takes order, brings food)
- Services = Kitchen (prepares food)
- Database = Pantry (stores ingredients)

---

## 🔥 Next Steps

Now you need to:
1. **Create service layer in React** to call these APIs
2. **Replace mock data** with real API calls
3. **Handle loading states** (show spinner while fetching)
4. **Handle errors** (show message if API fails)
5. **Configure CORS** on backend to allow frontend requests

Would you like me to implement the frontend service layer now? 🚀
