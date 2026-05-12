import { useState } from 'react'

const FAQS = [
  {
    q: 'Who can participate?',
    a: 'InnovateFest is open to all university students, regardless of their major or year of study. Both undergraduate and graduate students are welcome to apply.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'No! InnovateFest is completely free for all accepted attendees. We provide meals, snacks, workspace, and swag during the entire 36 hours.',
  },
  {
    q: 'Do I need a team?',
    a: 'You can register individually or as a team of up to 4 people. If you don\'t have a team, don\'t worry! We will host team-building events before the hacking begins.',
  },
  {
    q: 'What if I don\'t know how to code?',
    a: 'That is totally fine! Hackathons are a great place to learn. We will have beginner-friendly workshops and mentors available to help you build your first project.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx)
  }

  return (
    <section id="faq" className="py-24 relative">
      <div className="section-container max-w-3xl">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">FAQ</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {FAQS.map(({ q, a }, idx) => {
            const isOpen = openIndex === idx
            
            return (
              <div 
                key={idx} 
                className={`card overflow-hidden transition-colors duration-200 ${isOpen ? 'border-primary/30' : ''}`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:bg-surface-2/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-text-primary pr-8">{q}</span>
                  <span className={`font-mono text-lg leading-none transition-colors ${isOpen ? 'text-primary' : 'text-text-muted'}`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                
                {/* Answer Body (Animated) */}
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen 
                      ? 'max-h-40 opacity-100' 
                      : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="text-sm text-text-secondary leading-relaxed px-5 pb-5">
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
