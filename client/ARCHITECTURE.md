# Frontend Architecture Documentation

## Project Overview
This is a **React + Vite** frontend application for a **Community-Supervised Procedures Platform** where users can find governmental procedures, their steps, requirements, pricing, and duration. The platform allows community contributions through proposals and fix submissions, managed by administrators.

---

## Architecture Pattern: **Feature-Sliced Design with Service Layer**

This architecture is a **hybrid approach** that combines:
1. **Component-Based Architecture** (React standard)
2. **Service Layer Pattern** (API abstraction)
3. **Feature-Sliced Design** (organized by features)
4. **Context + Hooks Pattern** (state management)

**Why this architecture?**
- ✅ **Separation of Concerns**: Business logic (services) is separated from UI (components)
- ✅ **Reusability**: Common components and hooks can be reused across features
- ✅ **Maintainability**: Clear structure makes it easy to locate and modify code
- ✅ **Scalability**: Easy to add new features without affecting existing code
- ✅ **Testability**: Services and components can be tested independently
- ✅ **Team Collaboration**: Different team members can work on different layers without conflicts

**Better than pure MVP?** 
Yes, for this project! MVP (Model-View-Presenter) is more suited for traditional architectures. For modern React apps with APIs, this Service Layer + Feature-Sliced approach is more idiomatic and maintainable.

---

## Project Structure

\`\`\`
frontend/
├── public/                          # Static assets (images, icons, etc.)
├── src/
│   ├── main.jsx                     # Application entry point
│   ├── App.jsx                      # Root component with routing and providers
│   ├── App.css                      # Global styles
│   ├── index.css                    # Base/reset styles
│   │
│   ├── assets/                      # Images, fonts, etc.
│   │
│   ├── pages/                       # PAGE LAYER - Top-level route components
│   │   ├── Home.jsx                 # 🟢 SPRINT 1: Main landing page with search & filter
│   │   ├── DocumentDetails.jsx     # 🟢 SPRINT 1: Individual document page
│   │   ├── AboutUs.jsx              # 🟢 SPRINT 1: About the platform
│   │   ├── Profile.jsx              # 🔵 FUTURE: User profile & contributions
│   │   ├── ProposeDocument.jsx     # 🔵 FUTURE: Submit new document proposal
│   │   └── Admin/                   # Admin pages (protected)
│   │       ├── AdminDashboard.jsx   # 🔵 FUTURE: Admin overview
│   │       ├── ManageProposals.jsx  # 🔵 FUTURE: Review proposals
│   │       ├── ManageFixes.jsx      # 🔵 FUTURE: Review fixes
│   │       └── ManageDocuments.jsx  # 🔵 FUTURE: CRUD documents
│   │
│   ├── components/                  # COMPONENT LAYER
│   │   ├── common/                  # Reusable UI components
│   │   │   ├── Button.jsx           # Generic button
│   │   │   ├── Card.jsx             # Card container
│   │   │   ├── Input.jsx            # Form input
│   │   │   ├── Modal.jsx            # Modal dialog
│   │   │   ├── SearchBar.jsx        # Search input (moved from NavBar)
│   │   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   │   ├── Alert.jsx            # Toast/alert messages
│   │   │   ├── NavBar.jsx           # Navigation bar
│   │   │   └── ReportIssueButton.jsx # Fix reporting trigger
│   │   │
│   │   └── features/                # Feature-specific components
│   │       ├── DocumentCard.jsx     # Document preview card
│   │       ├── FilterPanel.jsx      # Filter sidebar/panel
│   │       ├── DocumentHeader.jsx   # Document detail header
│   │       ├── StepsList.jsx        # Step-by-step guide display
│   │       ├── RelatedDocuments.jsx # Related docs section
│   │       ├── FixModal.jsx         # Report issue modal
│   │       ├── LoginModal.jsx       # Login/auth modal
│   │       ├── DocumentForm.jsx     # Create/edit document form
│   │       ├── ProposalCard.jsx     # Proposal card (admin)
│   │       └── FixCard.jsx          # Fix card (admin)
│   │
│   ├── layouts/                     # LAYOUT LAYER
│   │   ├── MainLayout.jsx           # Common layout (nav + footer)
│   │   └── AdminLayout.jsx          # Admin layout (sidebar)
│   │
│   ├── routes/                      # ROUTING LAYER
│   │   └── AppRoutes.jsx            # Route definitions & protection
│   │
│   ├── services/                    # SERVICE LAYER - API communication
│   │   ├── apiClient.js             # Axios instance with interceptors
│   │   ├── documentService.js       # Document endpoints
│   │   ├── proposalService.js       # Proposal submission
│   │   ├── fixService.js            # Fix submission
│   │   ├── userService.js           # User profile endpoints
│   │   ├── authService.js           # Authentication endpoints
│   │   └── adminService.js          # Admin operations
│   │
│   ├── hooks/                       # CUSTOM HOOKS - Reusable logic
│   │   ├── useDocuments.js          # Fetch & manage documents
│   │   ├── useDocumentDetails.js    # Fetch single document
│   │   ├── useForm.js               # Form state management
│   │   ├── useModal.js              # Modal state management
│   │   └── useDebounce.js           # Debounce for search
│   │
│   ├── context/                     # STATE MANAGEMENT - Global state
│   │   └── AuthContext.jsx          # Authentication state & methods
│   │
│   ├── utils/                       # UTILITIES - Helper functions
│   │   ├── validation.js            # Form validation helpers
│   │   └── format.js                # Formatting (date, price, etc.)
│   │
│   └── constants/                   # CONSTANTS - App-wide constants
│       └── index.js                 # Types, routes, storage keys
│
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
└── eslint.config.js                 # ESLint configuration
\`\`\`

---

## Architecture Layers Explained

### 1. **Page Layer** (\`pages/\`)
**Purpose**: Route-level components that represent entire screens/views.

**Responsibilities**:
- Handle routing parameters (e.g., \`docId\` from URL)
- Compose multiple components together
- Use hooks to fetch data
- Pass data and callbacks to child components
- Manage page-level state

**Example Flow** (Home page):
1. Use \`useDocuments()\` hook to fetch documents
2. Render \`<SearchBar>\`, \`<FilterPanel>\`, and \`<DocumentCard>\` list
3. Handle search/filter events and pass to hook
4. Navigate to DocumentDetails on card click

**Sprint 1 Pages**: Home, DocumentDetails, AboutUs

---

### 2. **Component Layer** (\`components/\`)

#### **Common Components** (\`components/common/\`)
**Purpose**: Generic, reusable UI components with no business logic.

**Characteristics**:
- ✅ Fully reusable across the app
- ✅ No direct API calls
- ✅ Controlled by props
- ✅ Stateless or minimal internal state (e.g., dropdown open/closed)

**Examples**:
- \`Button\`: Variants (primary, secondary, danger), sizes, loading state
- \`Modal\`: Generic dialog wrapper
- \`Input\`: Form input with validation error display
- \`Card\`: Container with consistent styling

---

#### **Feature Components** (\`components/features/\`)
**Purpose**: Components specific to business features/domains.

**Characteristics**:
- ✅ Domain-specific (documents, proposals, fixes)
- ⚠️ May contain business logic
- ⚠️ May make API calls (through services)
- ✅ Reusable within their domain

**Examples**:
- \`DocumentCard\`: Displays document preview, navigates on click
- \`FixModal\`: Contains form logic for submitting fixes
- \`FilterPanel\`: Manages filter state and applies filters

---

### 3. **Service Layer** (\`services/\`)
**Purpose**: Abstract all API communication. Components never call APIs directly.

**Benefits**:
- ✅ Single source of truth for API endpoints
- ✅ Easy to mock for testing
- ✅ Centralized error handling
- ✅ Can switch backend/API without changing components

**Architecture**:
\`\`\`javascript
// apiClient.js - Base HTTP client
- Creates axios instance
- Adds auth token to all requests (interceptor)
- Handles global errors (401 → logout, 403 → forbidden)

// Specific services (documentService, authService, etc.)
- Import apiClient
- Define domain-specific methods
- Return promises with typed data
\`\`\`

**Example**:
\`\`\`javascript
// In component:
import documentService from '../services/documentService';

const fetchData = async () => {
  const docs = await documentService.getAllDocuments();
  setDocuments(docs);
};
\`\`\`

---

### 4. **Hooks Layer** (\`hooks/\`)
**Purpose**: Encapsulate reusable stateful logic.

**Benefits**:
- ✅ DRY principle (Don't Repeat Yourself)
- ✅ Separate logic from UI
- ✅ Easy to test
- ✅ Can be shared across components

**Hook Types**:

#### **Data Fetching Hooks** (\`useDocuments\`, \`useDocumentDetails\`)
- Manage loading, error, and data state
- Call services to fetch data
- Provide refetch methods

#### **Form Hooks** (\`useForm\`)
- Manage form values, validation, errors
- Handle submit logic

#### **UI Hooks** (\`useModal\`, \`useDebounce\`)
- Manage UI state (modal open/close)
- Optimize performance (debounce search)

**Example**:
\`\`\`javascript
const { documents, loading, error, fetchDocuments } = useDocuments();

useEffect(() => {
  fetchDocuments();
}, []);
\`\`\`

---

### 5. **Context Layer** (\`context/\`)
**Purpose**: Global state management (without Redux).

**When to use Context**:
- Authentication state (needed everywhere)
- Theme/language settings
- Any state needed by many components at different levels

**AuthContext Example**:
- Stores current user, isAuthenticated, isAdmin
- Provides login(), logout(), register() methods
- Wraps entire app in App.jsx
- Any component can access via \`useAuth()\` hook

**Benefits**:
- ✅ No prop drilling
- ✅ Centralized auth logic
- ✅ Automatic re-render on state change

---

### 6. **Layout Layer** (\`layouts/\`)
**Purpose**: Provide consistent page structure.

**MainLayout**:
- NavBar at top
- Main content area
- Footer at bottom
- Used for public pages

**AdminLayout**:
- Admin sidebar
- Top bar with user info
- Main content area
- Used for admin pages

**Usage**:
\`\`\`javascript
<MainLayout>
  <HomePage />
</MainLayout>
\`\`\`

---

### 7. **Routing Layer** (\`routes/\`)
**Purpose**: Define all application routes and access control.

**AppRoutes.jsx**:
- Maps URLs to page components
- Implements route protection (auth required, admin required)
- Uses React Router

**Route Types**:
- **Public**: Home, DocumentDetails, AboutUs
- **Protected**: Profile, ProposeDocument (requires login)
- **Admin**: AdminDashboard, ManageProposals, etc. (requires admin role)

**Protection Pattern**:
\`\`\`javascript
<ProtectedRoute requiresAuth requiresAdmin>
  <AdminDashboard />
</ProtectedRoute>
\`\`\`

---

### 8. **Utils & Constants**

**Utils** (\`utils/\`):
- Pure helper functions
- No state, no side effects
- Examples: validation, formatting, date handling

**Constants** (\`constants/\`)
- Document types list
- API route paths
- Storage keys
- Problem types for fixes

---

## Data Flow Architecture

### **Unidirectional Data Flow** (React standard)

\`\`\`
User Action → Component → Hook/Context → Service → API
                 ↑                                      ↓
                 └──────────── Response ←───────────────┘
\`\`\`

### **Example: Viewing Document Details**

1. **User** clicks DocumentCard
2. **Navigate** to \`/document/:docId\`
3. **DocumentDetails page** mounts
4. **Page** calls \`useDocumentDetails(docId)\` hook
5. **Hook** calls \`documentService.getDocumentById(docId)\`
6. **Service** uses \`apiClient\` to make GET request
7. **apiClient** adds auth token automatically
8. **API** returns document data
9. **Service** returns data to hook
10. **Hook** updates state (sets \`document\`, \`loading = false\`)
11. **Page** re-renders with data
12. **Components** (\`DocumentHeader\`, \`StepsList\`, etc.) display data

---

## Authentication Flow

### **Login Process**:
1. User fills LoginModal form
2. Form calls \`authService.login(email, password)\`
3. Service makes POST to \`/auth/login\`
4. Backend returns \`{ token, user }\`
5. Service stores token in localStorage
6. Service returns user data
7. AuthContext updates state (\`user\`, \`isAuthenticated = true\`)
8. App re-renders, user can access protected routes
9. All subsequent API calls automatically include token (apiClient interceptor)

### **Protected Route Check**:
1. User tries to access \`/profile\`
2. ProtectedRoute component checks \`isAuthenticated\`
3. If false → show LoginModal
4. If true → render page

---

## Sprint 1 Implementation Plan

### **Pages to Implement** (3 pages):
1. ✅ **Home**: Search, filter, document grid
2. ✅ **DocumentDetails**: Full document info with steps
3. ✅ **AboutUs**: Platform information

### **Components to Implement**:
**Common**:
- SearchBar, Button, Card, Modal, Input, LoadingSpinner, Alert, NavBar

**Features**:
- DocumentCard, FilterPanel, DocumentHeader, StepsList, RelatedDocuments, ReportIssueButton (displays button, modal comes later)

### **Services to Implement**:
- apiClient (setup axios)
- documentService (getAllDocuments, getDocumentById, getRelatedDocumentNames)
- Basic authService structure (for future login)

### **Hooks to Implement**:
- useDocuments
- useDocumentDetails
- useDebounce (for search optimization)

### **Routing**:
- Setup React Router
- Define routes for Home, DocumentDetails, AboutUs

---

## Best Practices & Conventions

### **1. File Naming**:
- Components: PascalCase (\`DocumentCard.jsx\`)
- Hooks: camelCase with "use" prefix (\`useDocuments.js\`)
- Services: camelCase with "Service" suffix (\`documentService.js\`)
- Utils: camelCase (\`validation.js\`)

### **2. Component Structure**:
\`\`\`javascript
// Imports
import React from 'react';
import { useDocuments } from '../hooks/useDocuments';

// Component
export default function ComponentName({ prop1, prop2 }) {
  // Hooks
  const { data, loading } = useDocuments();
  
  // State
  const [localState, setLocalState] = useState();
  
  // Effects
  useEffect(() => {}, []);
  
  // Event Handlers
  const handleClick = () => {};
  
  // Render
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
\`\`\`

### **3. Props Documentation**:
- Add JSDoc comments to component files
- Describe purpose, props, usage

### **4. Error Handling**:
- API errors caught by apiClient interceptor
- Display errors using Alert component
- Always show user-friendly messages

### **5. Loading States**:
- Always show loading indicator during data fetch
- Disable buttons during submission

### **6. Validation**:
- Client-side validation before API calls
- Use validation utils
- Display errors inline in forms

---

## Environment Variables

Create \`.env\` file in frontend root:
\`\`\`env
VITE_API_BASE_URL=http://localhost:3000/api
\`\`\`

Access in code:
\`\`\`javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
\`\`\`

---

## Future Enhancements (Post-Sprint 1)

### **Sprint 2** - User Features:
- Login/Register functionality
- User profile page
- Propose new documents
- Report fixes on documents

### **Sprint 3** - Admin Panel:
- Admin dashboard
- Manage proposals (approve/reject)
- Manage fixes (approve/reject)
- Edit/delete documents

### **Sprint 4** - Advanced Features:
- Advanced search (by price, duration, etc.)
- Pagination for document lists
- Image upload for proposals
- Notifications system
- User contribution statistics

---

## Testing Strategy (Future)

### **Unit Tests**:
- Services (mock axios)
- Hooks (React Testing Library)
- Utils (pure functions)

### **Integration Tests**:
- Component + Hook interactions
- Form submissions
- Navigation flows

### **E2E Tests** (Cypress/Playwright):
- Complete user flows
- Authentication
- Document submission

---

## Performance Optimization

### **Current**:
- ✅ Debounced search (useDebounce)
- ✅ Lazy loading (React.lazy for routes)
- ✅ Code splitting (Vite automatic)

### **Future**:
- Image optimization (lazy loading, WebP)
- Virtualized lists (react-window for large lists)
- Service Worker for offline support
- Caching strategies

---

## Deployment Considerations

### **Build**:
\`\`\`bash
npm run build
\`\`\`
Generates optimized \`dist/\` folder.

### **Environment-Specific Config**:
- \`.env.development\` - local API
- \`.env.production\` - production API URL

### **Static Hosting** (Netlify, Vercel, etc.):
- SPA mode (redirect all to index.html)
- Configure environment variables on platform

---

## Summary

This architecture provides:
- ✅ **Clear separation of concerns** (UI, logic, data)
- ✅ **Easy to understand and navigate**
- ✅ **Scalable** (add features without breaking existing code)
- ✅ **Maintainable** (locate and fix issues quickly)
- ✅ **Testable** (each layer can be tested independently)
- ✅ **Team-friendly** (multiple developers can work simultaneously)

**For Sprint 1**, focus on:
1. Building the 3 pages (Home, DocumentDetails, AboutUs)
2. Creating necessary common components
3. Setting up services and hooks
4. Implementing search and filter functionality
5. Ensuring responsive design

The architecture is ready to scale for future sprints! 🚀
