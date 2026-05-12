import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

// ─── Data ──────────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Hours of hacking', value: '36' },
  { label: 'Problem tracks', value: '5' },
  { label: 'Prize pool', value: '₹5L' },
]

const FEATURES = [
  {
    title: 'Compete for ₹5L+',
    desc: 'Multi-track prizes across AI, Web3, Sustainability, HealthTech, and Open Innovation.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4" />
        <path d="M12 17v4M8 21h8M6 9a6 6 0 0012 0V3H6v6z" />
      </svg>
    ),
  },
  {
    title: 'Network at scale',
    desc: 'Meet 1,000+ students, mentors from Stripe, Google, and Atlassian, plus top-tier VCs.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Ship in 36 hours',
    desc: 'Structured sprints, API credits, hardware kits, and mentors on-call around the clock.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: 'Learn from the best',
    desc: 'Curated workshops on LLMs, systems design, and product — running in parallel all weekend.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
  {
    title: 'Mentor-matched',
    desc: 'Every team gets a dedicated mentor from industry. No cold outreach — direct access.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="22" x2="14" y2="22" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14" />
      </svg>
    ),
  },
  {
    title: 'Demo to recruiters',
    desc: 'Closing expo is open to hiring companies. Your project in front of people with budget.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
]

const SCHEDULE = [
  { date: 'May 1', time: '12:00 AM', title: 'Registration Opens', desc: 'Applications open on a rolling basis — spots are limited and fill fast.' },
  { date: 'May 20', time: '11:59 PM', title: 'Registration Closes', desc: 'Final deadline. Team formation window closes along with applications.' },
  { date: 'May 25', time: '09:00 AM', title: 'Opening Ceremony', desc: 'Keynotes, track reveals, sponsor intros — the energy starts here.' },
  { date: 'May 25', time: '11:00 AM', title: 'Hacking Begins', desc: '36-hour timer starts. Mentors are live, API credits are loaded.' },
  { date: 'May 26', time: '11:00 PM', title: 'Submission Deadline', desc: 'Push your code, submit your Devpost link. No extensions.' },
  { date: 'May 27', time: '03:00 PM', title: 'Closing Ceremony & Prizes', desc: 'Top 10 demos, judge Q&A, winner announcements, and networking.' },
]

const FAQS = [
  { q: 'Who can participate?', a: 'Any enrolled university or college student — undergrad or postgrad, any major. Solo or in teams of up to 4.' },
  { q: 'Is there a registration fee?', a: 'Zero. Meals, snacks, merch, and workspace are all covered for the full 36 hours.' },
  { q: 'Do I need a team?', a: 'No. Register solo and join our team-formation event on May 25th morning — most solo applicants end up on great teams.' },
  { q: "What if I'm new to coding?", a: 'You are exactly who we want. Designers, domain experts, and first-time hackers are all valuable. Beginner workshops run all weekend.' },
]

// ─── Motion config ─────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease, delay: i * 0.08 },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Sub-components ────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-14 overflow-hidden">

      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.09) 0%, transparent 65%)',
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 text-center max-w-[44rem] mx-auto px-4 sm:px-6"
      >
        {/* Eyebrow badge */}
        <motion.div variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-2 border border-white/[0.1] bg-white/[0.03] backdrop-blur-sm text-indigo-400 text-[11px] font-mono tracking-[0.16em] uppercase px-3.5 py-1.5 rounded-full mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
            InnovateFest 2026 · May 25–27
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          className="font-display text-[3.25rem] sm:text-[4.5rem] md:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight mb-6"
        >
          <span className="text-text-primary">Build something</span>
          <br />
          <span className="gradient-text">that matters.</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-[1.0625rem] text-text-secondary leading-[1.7] max-w-[34rem] mx-auto mb-10"
        >
          36 hours. 5 tracks. India's premier student hackathon — open to every builder, designer, and domain expert.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          custom={3}
          className="flex flex-wrap items-center justify-center gap-3 mb-20"
        >
          <Link to="/register" className="btn-primary px-6 py-2.5 text-[13px] group">
            Register for free
            <svg className="transition-transform duration-200 group-hover:translate-x-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a href="#timeline" className="btn-secondary px-6 py-2.5 text-[13px]">
            View schedule
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeUp}
          custom={4}
          className="flex items-stretch justify-center divide-x divide-white/[0.07]"
        >
          {STATS.map(({ label, value }) => (
            <div key={label} className="px-8 sm:px-10 first:pl-0 last:pr-0 text-center">
              <div className="font-display text-[2rem] font-extrabold text-text-primary leading-none">
                {value}
              </div>
              <div className="text-[11px] text-text-muted uppercase tracking-widest mt-1.5 font-mono">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-28">
      <div className="section-container">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mb-16"
        >
          <motion.p variants={fadeUp} custom={0} className="section-eyebrow mb-3">
            <span className="w-4 h-[1px] bg-indigo-500" />
            About the event
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-display text-[2rem] sm:text-[2.5rem] font-extrabold text-text-primary leading-tight max-w-xl"
          >
            More than a hackathon.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-text-secondary text-base leading-relaxed max-w-2xl mt-4"
          >
            InnovateFest is a 36-hour sprint where the most driven student builders, designers, and domain experts converge to solve real problems — with real stakes.
          </motion.p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]"
        >
          {FEATURES.map(({ title, desc, icon }, i) => (
            <motion.div
              variants={fadeUp}
              custom={i}
              key={title}
              whileHover={{ scale: 1.015, backgroundColor: 'rgba(255,255,255,0.04)' }}
              transition={{ duration: 0.2 }}
              className="bg-[#0A0A0F] p-6 group cursor-default"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-500/15 group-hover:border-indigo-500/30 transition-colors duration-200">
                {icon}
              </div>
              <h3 className="text-[13px] font-semibold text-text-primary mb-1.5 tracking-tight">
                {title}
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

function Timeline() {
  return (
    <section id="timeline" className="py-28 border-y border-white/[0.06] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle at top right, rgba(99,102,241,0.06) 0%, transparent 60%)' }}
      />

      <div className="section-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mb-16"
        >
          <motion.p variants={fadeUp} custom={0} className="section-eyebrow mb-3">
            <span className="w-4 h-[1px] bg-indigo-500" />
            Schedule
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-display text-[2rem] sm:text-[2.5rem] font-extrabold text-text-primary leading-tight"
          >
            Event timeline.
          </motion.h2>
        </motion.div>

        {/* Timeline list — left-aligned, clean */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
          className="relative max-w-2xl"
        >
          {/* Vertical rail */}
          <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-white/[0.07]" />

          <div className="space-y-2">
            {SCHEDULE.map(({ date, time, title, desc }, idx) => {
              const isActive = idx === 2
              return (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  custom={idx}
                  className="flex gap-6 items-start group"
                >
                  {/* Node */}
                  <div className="relative z-10 flex-shrink-0 mt-0.5">
                    <div
                      className={`w-[38px] h-[38px] rounded-full flex items-center justify-center font-mono text-[11px] border transition-all duration-300 ${isActive
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.45)]'
                          : 'bg-[#111118] border-white/[0.1] text-text-muted'
                        }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Content card */}
                  <motion.div
                    whileHover={{ scale: 1.012, borderColor: 'rgba(99,102,241,0.3)' }}
                    transition={{ duration: 0.18 }}
                    className={`flex-1 rounded-xl border px-5 py-4 mb-4 transition-colors duration-200 ${isActive
                        ? 'border-indigo-500/30 bg-indigo-500/[0.05]'
                        : 'border-white/[0.07] bg-white/[0.02]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="font-mono text-[11px] text-indigo-400 font-medium">{date}</span>
                      <span className="text-white/[0.18] text-[10px]">·</span>
                      <span className="font-mono text-[11px] text-text-muted">{time}</span>
                      {isActive && (
                        <span className="ml-auto text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-[13px] font-semibold text-text-primary mb-1">{title}</h3>
                    <p className="text-[13px] text-text-secondary leading-relaxed">{desc}</p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="py-28">
      <div className="section-container max-w-[42rem]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="mb-16"
        >
          <motion.p variants={fadeUp} custom={0} className="section-eyebrow mb-3">
            <span className="w-4 h-[1px] bg-indigo-500" />
            FAQ
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-display text-[2rem] sm:text-[2.5rem] font-extrabold text-text-primary"
          >
            Quick answers.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
          className="space-y-2"
        >
          {FAQS.map(({ q, a }, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                custom={idx}
                className={`rounded-xl border overflow-hidden transition-colors duration-200 ${isOpen ? 'border-indigo-500/30 bg-indigo-500/[0.04]' : 'border-white/[0.07] bg-white/[0.02]'
                  }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="text-[13px] font-medium text-text-primary group-hover:text-white transition-colors">
                    {q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${isOpen ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400' : 'border-white/[0.1] text-text-muted'
                      }`}
                  >
                    <svg
                      width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>

                <div className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                  <p className="text-[13px] text-text-secondary leading-relaxed px-5 pb-5">{a}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">

          {/* Brand */}
          <div>
            <div className="font-display font-bold text-[13px] text-text-primary mb-1.5">
              Innovate<span className="text-indigo-400">Fest</span>
            </div>
            <p className="text-[11px] font-mono text-text-muted leading-relaxed">
              © 2026 InnovateFest. All rights reserved.<br />
              Built in India — by students, for students.
            </p>
          </div>

          {/* Links + Social */}
          <div className="flex flex-col items-center sm:items-end gap-4">
            <div className="flex gap-2">
              {[
                { label: 'Twitter', icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /> },
                { label: 'GitHub', icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /> },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-7 h-7 rounded-md border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-150"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {icon}
                  </svg>
                </a>
              ))}
            </div>
            <div className="flex gap-4">
              {['Code of Conduct', 'Privacy'].map(l => (
                <a key={l} href="#" className="text-[12px] text-text-muted hover:text-text-primary transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────

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
