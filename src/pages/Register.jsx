import { Link } from 'react-router-dom'
import RegistrationForm from '../components/RegistrationForm'

export default function Register() {
  return (
    <main className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center text-xs text-text-muted hover:text-text-primary transition-colors mb-6"
        >
          ← Back to Home
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            Register for InnovateFest 2026
          </h1>
          <p className="text-sm text-text-secondary">
            Fill in your details below. Registrations close on <strong className="text-text-primary">May 20, 2026</strong>.
          </p>
        </div>

        {/* Form Container */}
        <div className="card-elevated p-8">
          <RegistrationForm />
        </div>

        {/* Footer Note */}
        <p className="text-xs font-mono text-text-muted text-center mt-5">
          By registering, you agree to our Code of Conduct and Privacy Policy.
        </p>

      </div>
    </main>
  )
}
