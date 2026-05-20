import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

const STATS = [
  { label: 'Hours', value: '36' },
  { label: 'Tracks', value: '5' },
  { label: 'Prize pool', value: '₹5L' },
]

const FEATURES = [
  { title: 'Compete for ₹5L+', desc: 'Multi-track prizes across AI, Web3, Sustainability, HealthTech, and Open Innovation.', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4"/><path d="M12 17v4M8 21h8M6 9a6 6 0 0012 0V3H6v6z"/></svg> },
  { title: 'Network at scale', desc: 'Meet 1,000+ students, mentors from Stripe, Google, and Atlassian, plus top-tier VCs.', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { title: 'Ship in 36 hours', desc: 'Structured sprints, API credits, hardware kits, and mentors on-call round the clock.', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { title: 'Learn from the best', desc: 'Curated workshops on LLMs, systems design, and product — running all weekend.', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
  { title: 'Mentor-matched', desc: 'Every team gets a dedicated mentor from industry. No cold outreach — direct access.', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg> },
  { title: 'Demo to recruiters', desc: 'Closing expo is open to hiring companies. Your project in front of people with budget.', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
]

const SCHEDULE = [
  { date: 'May 15', time: '12:00 AM', title: 'Registration Opens',        desc: 'Applications open on a rolling basis — spots are limited and fill fast.' },
  { date: 'May 28', time: '11:59 PM', title: 'Registration Closes',       desc: 'Final deadline. Team formation window closes along with applications.' },
  { date: 'May 29', time: '09:00 AM', title: 'Opening Ceremony',          desc: 'Keynotes, track reveals, sponsor intros — the energy starts here.' },
  { date: 'May 29', time: '11:00 AM', title: 'Hacking Begins',            desc: '36-hour timer starts. Mentors are live, API credits are loaded.' },
  { date: 'May 30', time: '11:00 PM', title: 'Submission Deadline',       desc: 'Push your code, submit your Devpost link. No extensions.' },
  { date: 'May 31', time: '03:00 PM', title: 'Closing Ceremony & Prizes', desc: 'Top 10 demos, judge Q&A, winner announcements, and networking.' },
]

const FAQS = [
  { q: 'Who can participate?',         a: 'Any enrolled university or college student — undergrad or postgrad, any major. Solo or in teams of up to 4.' },
  { q: 'Is there a registration fee?', a: 'Zero. Meals, snacks, merch, and workspace are all covered for the full 36 hours.' },
  { q: 'Do I need a team?',            a: 'No. Register solo and join our team-formation event on May 29th morning — most solo applicants end up on great teams.' },
  { q: "What if I'm new to coding?",   a: 'You are exactly who we want. Designers, domain experts, and first-time hackers are all valuable. Beginner workshops run all weekend.' },
]

const ease = [0.22, 1, 0.36, 1]
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease, delay: i * 0.08 } }),
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

// ── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="relative min-h-[88vh] flex items-center justify-center pt-14 overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div aria-hidden className="absolute top-0 inset-x-0 h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />

      <motion.div initial="hidden" animate="visible" variants={stagger}
        className="relative z-10 text-center w-full max-w-[56rem] mx-auto px-6">

        <motion.div variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-2 border border-white/[0.1] bg-white/[0.03] text-indigo-400 text-[11px] font-mono tracking-[0.16em] uppercase px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-slow" />
            InnovateFest 2026 · May 29–31
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1}
          className="font-display text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] font-extrabold leading-[1.02] tracking-tight mb-5">
          <span className="text-white">Build something</span><br />
          <span className="gradient-text">that matters.</span>
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} className="text-[1.0625rem] text-text-secondary leading-relaxed max-w-[32rem] mx-auto mb-9">
          36 hours. 5 tracks. India's premier student hackathon — open to every builder, designer, and domain expert.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <Link to="/register" className="btn-primary px-7 py-2.5 text-[13px] group">
            Register for free
            <svg className="transition-transform duration-200 group-hover:translate-x-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="#timeline" className="btn-secondary px-7 py-2.5 text-[13px]">View schedule</a>
        </motion.div>

        {/* Stats — full-width row with separators */}
        <motion.div variants={fadeUp} custom={4}
          className="grid grid-cols-3 divide-x divide-white/[0.07] border border-white/[0.07] rounded-2xl bg-white/[0.02] overflow-hidden">
          {STATS.map(({ label, value }) => (
            <div key={label} className="py-5 text-center">
              <div className="font-display text-[2.25rem] font-extrabold text-white leading-none">{value}</div>
              <div className="font-mono text-[12px] text-text-muted uppercase tracking-widest mt-2">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── About ─────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header row — text left, description right */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-end">
          <div>
            <motion.p variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 text-[12px] font-mono text-indigo-400 uppercase tracking-[0.18em] mb-3">
              <span className="w-4 h-[1px] bg-indigo-500" />About the event
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-[2.25rem] sm:text-[3rem] font-extrabold text-white leading-tight">
              More than<br />a hackathon.
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} custom={2} className="text-text-secondary text-[15px] leading-[1.7] lg:pt-2">
            InnovateFest is a 36-hour sprint where the most driven student builders, designers, and domain experts converge to solve real problems — with real stakes, real mentors, and real prizes.
          </motion.p>
        </motion.div>

        {/* Feature grid — full width, 3 cols */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {FEATURES.map(({ title, desc, icon }, i) => (
            <motion.div variants={fadeUp} custom={i} key={title}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              transition={{ duration: 0.15 }}
              className="bg-[#0A0A0F] p-5 group cursor-default">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/15 transition-colors duration-150">
                {icon}
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Timeline ──────────────────────────────────────────────────────────────
function Timeline() {
  return (
    <section id="timeline" className="py-20 border-y border-white/[0.06] relative overflow-hidden">
      <div aria-hidden className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(99,102,241,0.05) 0%, transparent 60%)' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-end">
          <div>
            <motion.p variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 text-[11px] font-mono text-indigo-400 uppercase tracking-[0.18em] mb-3">
              <span className="w-4 h-[1px] bg-indigo-500" />Schedule
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-[2.25rem] sm:text-[3rem] font-extrabold text-white leading-tight">
              Event<br />timeline.
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} custom={2} className="text-text-secondary text-[15px] leading-[1.7]">
            From registrations to the closing ceremony — here's how the weekend unfolds. Mark your calendar and show up ready to build.
          </motion.p>
        </motion.div>

        {/* Two-column grid of timeline cards */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCHEDULE.map(({ date, time, title, desc }, idx) => {
            const isActive = idx === 1
            return (
              <motion.div variants={fadeUp} custom={idx} key={title}
                whileHover={{ scale: 1.012, borderColor: 'rgba(99,102,241,0.28)' }}
                transition={{ duration: 0.18 }}
                className={`flex gap-4 p-5 rounded-xl border transition-colors duration-200 ${
                  isActive ? 'border-indigo-500/30 bg-indigo-500/[0.05]' : 'border-white/[0.07] bg-white/[0.02]'
                }`}>
                {/* Step number */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-mono text-[11px] border mt-0.5 ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_18px_rgba(99,102,241,0.45)]'
                    : 'bg-white/[0.04] border-white/[0.1] text-text-muted'
                }`}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[13px] text-indigo-400 font-medium">{date}</span>
                    <span className="text-white/[0.15] text-[11px]">·</span>
                    <span className="font-mono text-[13px] text-text-muted">{time}</span>
                    {isActive && (
                      <span className="ml-auto text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5">{title}</h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Two-column: heading left, accordions right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* Left: sticky heading */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
            className="lg:sticky lg:top-24">
            <motion.p variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 text-[11px] font-mono text-indigo-400 uppercase tracking-[0.18em] mb-3">
              <span className="w-4 h-[1px] bg-indigo-500" />FAQ
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-[2.25rem] sm:text-[3rem] font-extrabold text-white leading-tight mb-4">
              Quick<br />answers.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-[15px] text-text-secondary leading-[1.7] mb-6">
              Everything you need to know before applying. Still have questions? Email us.
            </motion.p>
            <motion.a variants={fadeUp} custom={3} href="mailto:hello@innovatefest.in"
              className="inline-flex items-center gap-1.5 text-[14px] text-indigo-400 hover:text-indigo-300 transition-colors group">
              Contact us
              <svg className="transition-transform group-hover:translate-x-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </motion.a>
          </motion.div>

          {/* Right: accordion list */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger}
            className="space-y-2">
            {FAQS.map(({ q, a }, idx) => {
              const isOpen = openIndex === idx
              return (
                <motion.div variants={fadeUp} custom={idx} key={idx}
                  className={`rounded-xl border overflow-hidden transition-colors duration-200 ${
                    isOpen ? 'border-indigo-500/30 bg-indigo-500/[0.04]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]'
                  }`}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group focus-visible:outline-none"
                    aria-expanded={isOpen}>
                    <span className="text-[15px] font-medium text-white group-hover:text-white transition-colors">{q}</span>
                    <span className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                      isOpen ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400' : 'border-white/[0.1] text-text-muted'
                    }`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                    <p className="text-[14px] text-text-secondary leading-[1.7] px-5 pb-5">{a}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          <div>
            <div className="font-display font-bold text-[13px] text-white mb-1.5">
              Innovate<span className="text-indigo-400">Fest</span>
            </div>
            <p className="text-[12px] font-mono text-text-muted leading-relaxed">
              © 2026 InnovateFest. Built in India — by students, for students.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-3">
            <div className="flex gap-2">
              {[
                { label: 'Twitter', d: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
                { label: 'GitHub', d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
              ].map(({ label, d }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-7 h-7 rounded-md border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-text-muted hover:text-white hover:border-white/[0.15] transition-all duration-150">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
                </a>
              ))}
            </div>
            <div className="flex gap-4">
              {['Code of Conduct', 'Privacy'].map(l => (
                <a key={l} href="#" className="text-[13px] text-text-muted hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
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
