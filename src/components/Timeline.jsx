/**
 * src/components/Timeline.jsx
 *
 * Visual event schedule displayed as a vertical timeline.
 * WHY vertical timeline: intuitive for sequential steps, works great on mobile.
 * The alternating left/right layout on desktop creates visual interest.
 *
 * COMMON MISTAKE: Don't use absolute positioning for the line if you want it
 * to grow with content. Use a flex column with a border on the child instead.
 */

const TIMELINE_EVENTS = [
  {
    date:  'May 1',
    time:  '12:00 PM',
    title: 'Registrations Open',
    desc:  'Submit your team or solo application. Early bird slots are limited.',
    icon:  '📋',
    color: 'from-brand-500 to-brand-600',
  },
  {
    date:  'May 20',
    time:  '11:59 PM',
    title: 'Registration Deadline',
    desc:  'Last day to register. Shortlisted participants will be notified within 48 hours.',
    icon:  '⏰',
    color: 'from-accent-500 to-accent-600',
  },
  {
    date:  'May 25',
    time:  '10:00 AM',
    title: 'Hackathon Begins',
    desc:  'Opening ceremony, team introductions, and problem statement reveal. The clock starts!',
    icon:  '🚀',
    color: 'from-green-500 to-emerald-600',
  },
  {
    date:  'May 26',
    time:  '12:00 PM',
    title: 'Mid-point Review',
    desc:  'Mentors review progress. Pivot if needed — mentors are here to guide you.',
    icon:  '🎯',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    date:  'May 26',
    time:  '10:00 PM',
    title: 'Final Submissions',
    desc:  'Submit your GitHub repo, demo video, and presentation deck by 10 PM sharp.',
    icon:  '📦',
    color: 'from-pink-500 to-rose-600',
  },
  {
    date:  'May 27',
    time:  '02:00 PM',
    title: 'Demo Day & Awards',
    desc:  'Present to judges. Top 10 teams demo live. Awards ceremony and closing event.',
    icon:  '🏆',
    color: 'from-brand-400 to-accent-500',
  },
]

export default function Timeline() {
  return (
    <section id="timeline" className="py-24 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-600/40 to-transparent" />

      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Schedule
          </p>
          <h2 className="section-title">
            Event <span className="gradient-text">Timeline</span>
          </h2>
        </div>

        {/* Timeline list */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-600/60 via-accent-500/40 to-transparent md:-translate-x-px" />

          <div className="space-y-10">
            {TIMELINE_EVENTS.map(({ date, time, title, desc, icon, color }, idx) => {
              // On desktop, alternate left and right
              const isRight = idx % 2 !== 0

              return (
                <div
                  key={title}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isRight ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  {/* Icon bubble — sits on the vertical line */}
                  <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg shadow-brand-900/50 md:mx-auto`}>
                    {icon}
                  </div>

                  {/* Card */}
                  <div
                    className={`glass-card p-5 flex-1 hover:bg-white/10 transition-all duration-300 md:max-w-[calc(50%-3rem)] ${
                      isRight ? 'md:mr-8' : 'md:ml-8'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-brand-400 font-bold text-sm">{date}</span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-slate-400 text-xs">{time}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
