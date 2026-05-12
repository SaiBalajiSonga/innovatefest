import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

// --- DATA CONSTANTS ---
const STATS = [
  { label: 'Hours', value: '36' },
  { label: 'Tracks', value: '5' },
  { label: 'Prizes', value: '₹5L' },
]

const FEATURES = [
  {
    title: 'Win Big',
    desc: 'Compete for a massive prize pool of over ₹5,000,000 across multiple tracks and challenges.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4"/>
        <path d="M12 17v4M8 21h8M6 9a6 6 0 0012 0V3H6v6z"/>
      </svg>
    ),
  },
  {
    title: 'Network',
    desc: 'Connect with 1000+ passionate students, mentors, and industry leaders from around the world.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Launch',
    desc: 'Turn your crazy ideas into reality in just 36 hours. Get support to take your project further.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'Learn',
    desc: 'Attend exclusive workshops and tech talks by engineers from top tech companies.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
  },
  {
    title: 'Innovate',
    desc: 'Push boundaries. We provide the hardware, API credits, and mentors. You provide the code.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/>
      </svg>
    ),
  },
  {
    title: 'Showcase',
    desc: 'Demo your hacks to top-tier VC judges and tech recruiters looking for the next big thing.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
  },
]

const SCHEDULE = [
  { date: 'May 1', time: '12:00 AM', title: 'Registration Opens', desc: 'Secure your spot! We accept applications on a rolling basis until capacity is reached.' },
  { date: 'May 20', time: '11:59 PM', title: 'Registration Closes', desc: 'Last chance to register. Team formations must be finalized by this date.' },
  { date: 'May 25', time: '09:00 AM', title: 'Opening Ceremony', desc: 'Kickoff! Keynote speakers, theme announcements, and track details revealed.' },
  { date: 'May 25', time: '11:00 AM', title: 'Hacking Begins', desc: '36 hours on the clock. Get coding! Mentors will be circulating to help you brainstorm.' },
  { date: 'May 26', time: '11:00 PM', title: 'Hacking Ends', desc: 'Pens down, keyboards away. Submit your projects to Devpost for judging.' },
  { date: 'May 27', time: '03:00 PM', title: 'Closing Ceremony & Winners', desc: 'Live demos from top 10 teams, prize distributions, and closing notes.' },
]

const FAQS = [
  { q: 'Who can participate?', a: 'InnovateFest is open to all university students, regardless of their major or year of study. Both undergraduate and graduate students are welcome to apply.' },
  { q: 'Is there a registration fee?', a: 'No! InnovateFest is completely free for all accepted attendees. We provide meals, snacks, workspace, and swag during the entire 36 hours.' },
  { q: 'Do I need a team?', a: 'You can register individually or as a team of up to 4 people. If you don\'t have a team, don\'t worry! We will host team-building events before the hacking begins.' },
  { q: 'What if I don\'t know how to code?', a: 'That is totally fine! Hackathons are a great place to learn. We will have beginner-friendly workshops and mentors available to help you build your first project.' },
]

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// --- SUBCOMPONENTS ---

function Hero() {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />

      <motion.div 
        initial="hidden" animate="visible" variants={staggerContainer}
        className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-mono px-4 py-1.5 rounded-full mb-10">
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse-slow" />
          InnovateFest 2026 &nbsp;·&nbsp; May 25–27
        </motion.div>

        <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6">
          <span className="text-text-primary">Build Something</span><br />
          <span className="gradient-text">That Matters.</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-text-secondary text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          36 hours. 5 tracks. India's premier student hackathon — open to every builder, designer, and domain expert.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <Link to="/register" className="btn-primary px-6 py-3 text-sm group">
            Register Now
            <svg className="transition-transform group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="#timeline" className="btn-secondary px-6 py-3 text-sm">
            View Schedule
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-y-6 divide-x divide-surface-border">
          {STATS.map(({ label, value }) => (
            <div key={label} className="px-6 md:px-8 first:pl-0 last:pr-0 text-center">
              <div className="font-display text-2xl font-bold text-text-primary">{value}</div>
              <div className="text-xs text-text-muted uppercase tracking-widest mt-0.5 font-mono">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-24 relative">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        className="section-container relative z-10"
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="section-label mb-3">About the Event</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">What is InnovateFest?</h2>
          <p className="text-text-secondary text-base max-w-2xl mx-auto leading-relaxed">
            More than just a hackathon, InnovateFest is a 36-hour celebration of technology, creativity, and the developer community. We bring together the brightest minds to solve real-world problems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ title, desc, icon }) => (
            <motion.div variants={fadeUp} key={title} className="card p-6 group hover:-translate-y-1 hover:border-primary/40 transition-all duration-300">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function Timeline() {
  return (
    <section id="timeline" className="py-24 bg-surface-1 border-y border-surface-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
        className="section-container relative z-10"
      >
        <div className="text-center mb-16">
          <p className="section-label mb-3">Schedule</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">Event Timeline</h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-surface-border md:left-1/2 md:-translate-x-1/2" />
          
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-8">
            {SCHEDULE.map(({ date, time, title, desc }, idx) => {
              const isActive = idx === 2;
              return (
                <motion.div variants={fadeUp} key={title} className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-8 h-8">
                    <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs transition-colors duration-300 ${isActive ? 'border-primary text-primary bg-surface shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'border-surface-border bg-surface-2 text-text-muted'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="ml-12 md:ml-0 flex-1 md:w-1/2 flex flex-col group">
                    <div className={`card p-5 flex-1 transition-all duration-300 md:max-w-[calc(100%-1.5rem)] hover:-translate-y-1 ${idx % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} ${isActive ? 'border-primary/40 bg-surface-2/50' : 'hover:border-surface-border/80'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-primary">{date}</span>
                        <span className="text-surface-border text-xs">·</span>
                        <span className="font-mono text-xs text-text-muted">{time}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-text-primary mb-1.5">{title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="py-24 relative">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
        className="section-container max-w-3xl"
      >
        <div className="text-center mb-14">
          <p className="section-label mb-3">FAQ</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, idx) => {
            const isOpen = openIndex === idx
            return (
              <div key={idx} className={`card overflow-hidden transition-colors duration-200 ${isOpen ? 'border-primary/40 bg-surface-2/30' : 'hover:border-surface-border/80'}`}>
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-text-primary pr-8">{q}</span>
                  <span className={`font-mono text-lg leading-none transition-transform duration-300 ${isOpen ? 'text-primary rotate-180' : 'text-text-muted'}`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                  <p className="text-sm text-text-secondary leading-relaxed px-5 pb-5">{a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="font-display font-semibold text-text-primary mb-2">InnovateFest</div>
            <p className="text-xs font-mono text-text-muted">
              &copy; 2026 InnovateFest. All rights reserved.<br />Built in India — by students, for students.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg border border-surface-border bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-primary/40 transition-all duration-150"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
              <a href="#" className="w-8 h-8 rounded-lg border border-surface-border bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-primary/40 transition-all duration-150"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg></a>
            </div>
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

// --- MAIN PAGE EXPORT ---
export default function Landing() {
  return (
    <main className="min-h-screen bg-surface overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Timeline />
      <FAQ />
      <Footer />
    </main>
  )
}
