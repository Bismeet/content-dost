import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Lazy load public site and admin portal components to ensure code-splitting and bundle isolation
const PublicApp = lazy(() => import('./App.tsx'));
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage.tsx'));
const AdminLeadsPage = lazy(() => import('./admin/pages/AdminLeadsPage.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div style={{ backgroundColor: '#050604', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f5ef', fontFamily: 'monospace', fontSize: '12px' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<PublicApp />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/leads" element={<AdminLeadsPage />} />
          <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
