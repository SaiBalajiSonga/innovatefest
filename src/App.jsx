/**
 * src/App.jsx
 *
 * Root component: sets up React Router and the global Toaster.
 * WHY BrowserRouter here: keeps routing concerns out of main.jsx
 * so the app tree is easy to test in isolation.
 *
 * Route guard pattern: Admin wraps its own redirect internally (see Admin.jsx).
 * We keep App.jsx simple — it only declares routes.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Landing    from './pages/Landing'
import Register   from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import Admin      from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      {/*
        Global toast container.
        position="top-center" keeps notifications visible without blocking content.
        The dark glass style matches the overall dark theme.
      */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1b4b',
            color: '#e0e7ff',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#e0e7ff' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1e1b4b' } },
        }}
      />

      <Routes>
        <Route path="/"              element={<Landing />}    />
        <Route path="/register"      element={<Register />}   />
        <Route path="/admin/login"   element={<AdminLogin />} />
        <Route path="/admin"         element={<Admin />}      />
        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*"              element={<Landing />}    />
      </Routes>
    </BrowserRouter>
  )
}
