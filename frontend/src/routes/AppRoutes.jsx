import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import DocumentPage from '../pages/Document'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/document/:slug" element={<DocumentPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
