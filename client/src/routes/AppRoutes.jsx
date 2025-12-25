import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import DocumentDetails from '../pages/DocumentDetails'
import AllDocuments from '../pages/AllDocuments'

import ContactUs from '../pages/ContactUs'
import AboutUs from '../pages/AboutUs'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import RecoverPassword from '../pages/RecoverPassword'
import FixFormPage from '../pages/FixForm';
// Future pages (to be implemented in later sprints)
import Profile from '../pages/Profile'


// Admin pages
import AdminDashboard from '../pages/Admin/AdminDashboard'
import ManageProposedDocs from '../pages/Admin/ManageProposedDocs'
import ManageProposedFixes from '../pages/Admin/ManageProposedFixes'

// Protected Route
import ProtectedRoute from '../components/ProtectedRoute'
import ProposeDocument from '../pages/ProposeDocument'
// import AdminDashboard from '../pages/Admin/AdminDashboard'
// import ManageProposals from '../pages/Admin/ManageProposals'
// import ManageFixes from '../pages/Admin/ManageFixes'
// import ManageDocuments from '../pages/Admin/ManageDocuments'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Sprint 1 Routes - Public */}
      <Route path="/" element={<Home />} />
      <Route path="/documents" element={<AllDocuments />} />
      <Route path="/document/:docId" element={<DocumentDetails />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/conntact" element={<ContactUs />} />
      
      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/recover-password" element={<RecoverPassword />} />

      {/* Future Sprint Routes - Protected (User) */}
      <Route path="/profile" element={<Profile />} />

      <Route path="/fixform/:docid" element={<FixFormPage />} />
      <Route path="/propose" element={<ProposeDocument />} />
      {/* Admin Routes - Protected (Admin Only) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/proposals" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ManageProposedDocs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/fixes" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ManageProposedFixes />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
