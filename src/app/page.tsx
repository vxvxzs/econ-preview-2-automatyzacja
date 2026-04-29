import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Solutions from '@/components/Solutions'
import Process from '@/components/Process'
import LocalAuthority from '@/components/LocalAuthority'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Solutions />
      <Process />
      <LocalAuthority />
      <Contact />
      <Footer />
    </main>
  )
}
