/**
 * src/components/Footer.jsx
 *
 * Page footer with brand, quick links, and social icons.
 * Kept intentionally minimal to not distract from the CTA above it.
 */
import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Home',     href: '/',        isRoute: true  },
  { label: 'Register', href: '/register', isRoute: true  },
  { label: 'FAQ',      href: '#faq',      isRoute: false },
  { label: 'Timeline', href: '#timeline', isRoute: false },
]

const SOCIALS = [
  {
    label: 'Twitter',
    href:  'https://twitter.com',
    icon:  (
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    ),
  },
  {
    label: 'LinkedIn',
    href:  'https://linkedin.com',
    icon:  (
      <>
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: 'Instagram',
    href:  'https://instagram.com',
    icon:  (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="font-display text-2xl font-black gradient-text">InnovateFest</span>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">
              Building tomorrow's solutions today. A national student hackathon.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
              {LINKS.map(({ label, href, isRoute }) =>
                isRoute ? (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-slate-400 hover:text-brand-300 text-sm transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ) : (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-slate-400 hover:text-brand-300 text-sm transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-brand-900/60 border border-brand-700/40 flex items-center justify-center text-slate-400 hover:text-brand-300 hover:border-brand-500/60 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                  {icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600 text-xs">
          <p>© {year} InnovateFest. All rights reserved.</p>
          <p>Made with ❤️ by students, for students.</p>
        </div>
      </div>
    </footer>
  )
}
