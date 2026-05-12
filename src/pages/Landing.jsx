/**
 * src/pages/Landing.jsx
 *
 * The public home page. Composes all landing sections.
 * WHY separate section components: keeps this file concise and
 * allows each section to manage its own state/animations independently.
 */
import Hero     from '../components/Hero'
import About    from '../components/About'
import Timeline from '../components/Timeline'
import FAQ      from '../components/FAQ'
import Footer   from '../components/Footer'

export default function Landing() {
  return (
    <main className="min-h-screen bg-brand-950 overflow-x-hidden">
      <Hero />
      <About />
      <Timeline />
      <FAQ />
      <Footer />
    </main>
  )
}
