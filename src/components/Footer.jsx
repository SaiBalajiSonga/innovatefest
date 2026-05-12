export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand & Copyright */}
          <div className="text-center md:text-left">
            <div className="font-display font-semibold text-text-primary mb-2">
              InnovateFest
            </div>
            <p className="text-xs font-mono text-text-muted">
              &copy; 2026 InnovateFest. All rights reserved.
              <br />
              Built in India — by students, for students.
            </p>
          </div>

          {/* Social Links & Legal */}
          <div className="flex flex-col items-center md:items-end gap-4">
            
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg border border-surface-border bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-primary/40 transition-all duration-150" aria-label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg border border-surface-border bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-primary/40 transition-all duration-150" aria-label="GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                </svg>
              </a>
            </div>

            {/* Links */}
            <div className="flex gap-4">
              <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors">Code of Conduct</a>
              <a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors">Privacy</a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}
