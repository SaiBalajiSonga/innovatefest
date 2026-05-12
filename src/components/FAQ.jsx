/**
 * src/components/FAQ.jsx
 *
 * Accordion FAQ: only one item open at a time.
 * WHY useState with an index instead of a boolean per item:
 * Setting `openIndex` to the same index closes it (toggle),
 * and setting a new index automatically closes the previous one — no extra logic.
 *
 * COMMON MISTAKE: Using multiple `isOpen` booleans per item means you
 * have to manually close others. A single index avoids that.
 */
import { useState } from 'react'

const FAQ_ITEMS = [
  {
    q: 'Who can participate in InnovateFest?',
    a: 'Any student currently enrolled in an undergraduate or postgraduate programme at a recognised college or university is eligible. You can participate solo or in a team of up to 4 members.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'No, InnovateFest is completely free to register and participate. We believe great ideas shouldn\'t be gated by money.',
  },
  {
    q: 'Do I need a team to register?',
    a: 'No. Solo registrations are welcome. We will have a team-formation session at the start of the event if you would like to find collaborators.',
  },
  {
    q: 'What should I bring on the day?',
    a: 'Bring your laptop, chargers, any hardware you plan to use, a student ID card, and lots of enthusiasm! Food and beverages will be provided throughout the 36 hours.',
  },
  {
    q: 'What problem statements can we work on?',
    a: 'We have 5 tracks: HealthTech, EdTech, FinTech, Green Tech, and Open Innovation. Problem statements for each track will be revealed at the opening ceremony.',
  },
  {
    q: 'Will there be mentors available?',
    a: 'Yes! We\'ll have 30+ mentors from top tech companies and startups available throughout the event for 1:1 sessions and technical support.',
  },
  {
    q: 'How are winners decided?',
    a: 'Projects are judged on Innovation (30%), Technical Complexity (25%), Impact (25%), and Presentation (20%). A panel of 8 judges from industry will evaluate the top 10 teams.',
  },
  {
    q: 'When will I hear back after registering?',
    a: 'Shortlisted participants will receive a confirmation email within 48 hours of the registration deadline (May 20). Check your spam folder if you don\'t hear back.',
  },
]

export default function FAQ() {
  // null means no item is open
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (idx) => setOpenIndex(prev => prev === idx ? null : idx)

  return (
    <section id="faq" className="py-24 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-600/40 to-transparent" />

      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Got Questions?
          </p>
          <h2 className="section-title">
            Frequently <span className="gradient-text">Asked Questions</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map(({ q, a }, idx) => {
            const isOpen = openIndex === idx

            return (
              <div
                key={q}
                className={`glass-card overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-brand-500/40' : 'hover:border-white/20'
                }`}
              >
                {/* Question button */}
                <button
                  id={`faq-btn-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
                >
                  <span className={`font-semibold text-base transition-colors duration-200 ${isOpen ? 'text-brand-300' : 'text-white'}`}>
                    {q}
                  </span>
                  {/* Animated chevron */}
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-brand-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Answer panel — CSS max-height trick for smooth animation */}
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                >
                  <p className="px-6 pb-5 text-slate-400 leading-relaxed text-sm">
                    {a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
