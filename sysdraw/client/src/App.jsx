/**
 * SysDraw - App Root
 * Sets up React Router with protected routes
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EditorPage from './pages/EditorPage';
import './styles/global.css';

// Route guard: redirect to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useApp();
  if (isAuthLoading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#7c6ef7',fontSize:14 }}>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/editor"
      element={
        <ProtectedRoute>
          <EditorPage />
        </ProtectedRoute>
      }
    />
    {/* Default redirect */}
    <Route path="*" element={<Navigate to="/editor" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </BrowserRouter>
);

export default App;
