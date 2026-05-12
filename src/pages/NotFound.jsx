/**
 * src/pages/NotFound.jsx
 *
 * 404 Error page for handling broken links or unknown routes.
 */
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-950 flex items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/40 via-brand-950 to-brand-950 pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto">
        <h1 className="font-display text-8xl sm:text-9xl font-black text-brand-500/20 mb-2">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-400 mb-8">
          Oops! It looks like the page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          ← Return to Home
        </Link>
      </div>
    </main>
  )
}
