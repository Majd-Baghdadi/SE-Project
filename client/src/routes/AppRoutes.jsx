import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Home from '../pages/Home'
import DocumentDetails from '../pages/DocumentDetails'
import AllDocuments from '../pages/AllDocuments'

import ContactUs from '../pages/ContactUs'
import AboutUs from '../pages/AboutUs'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import RecoverPassword from '../pages/RecoverPassword'
import VerifyEmail from '../pages/VerifyEmail'
import ResetPassword from '../pages/ResetPassword'
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

export default function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className={`flex-1 ${!isHome ? 'pt-20' : ''}`}>
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
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Future Sprint Routes - Protected (User) */}
          <Route path="/profile" element={<Profile />} />

          <Route path="/fixform/:docid" element={<FixFormPage />} />
          <Route path="/propose" element={<ProposeDocument />} />

          {/* Admin Routes */}
          <Route
            path="/admin/proposals"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageProposedDocs />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/fixes" element={<ProtectedRoute requiredRole="admin"><ManageProposedFixes /></ProtectedRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
