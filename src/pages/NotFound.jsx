import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-mono text-8xl font-bold text-surface-border mb-6">404</div>
        <h1 className="font-display text-2xl font-bold text-text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-text-secondary mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </main>
  )
}
