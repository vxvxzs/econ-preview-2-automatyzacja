'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Sun, Flame, BatteryFull, ArrowRight } from 'lucide-react'
import { ST_DEFAULTS } from '@/lib/gsap-utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const solutions = [
  {
    id: 'pv-only',
    icon: Sun,
    title: 'System Fotowoltaiczny',
    description: 'Klasyczna instalacja PV z monitoringiem i dokumentacją do OSD.',
    features: [
      'Indywidualny dobór mocy',
      'Falowniki certyfikowanych producentów',
      'Zdalny monitoring uzysków',
      'Wsparcie w dokumentacji do operatora OSD',
    ],
    featured: false,
  },
  {
    id: 'pv-hp',
    icon: Flame,
    title: 'Integracja: PV + Pompa Ciepła',
    description: 'Kompleksowa termomodernizacja budynku — energia + ogrzewanie.',
    features: [
      'Dobór pompy powietrze-woda',
      'Pełne pokrycie zapotrzebowania na CO i CWU',
      'Synchronizacja pracy urządzeń',
      'Pomoc w dotacjach (Czyste Powietrze)',
    ],
    featured: true,
  },
  {
    id: 'autonomy',
    icon: BatteryFull,
    title: 'Autonomia: PV + Pompa + Magazyn',
    description: 'Maksymalna niezależność energetyczna i bezpieczeństwo zasilania.',
    features: [
      'Magazynowanie nadwyżek energii',
      'Zabezpieczenie przed przerwami w dostawie (EPS)',
      'Optymalizacja autokonsumpcji',
      'Integracja Smart Home',
    ],
    featured: false,
  },
]

export default function Solutions() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Header
    gsap.from(headerRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.current,
        ...ST_DEFAULTS,
      },
    })

    // Cards stagger
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.solution-card')
    if (cards && cards.length) {
      gsap.from(cards, {
        opacity: 0,
        y: 70,
        scale: 0.96,
        rotationX: 8,
        transformPerspective: 900,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          ...ST_DEFAULTS,
        },
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="systemy"
      className="py-28 bg-zinc-950 border-t border-zinc-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="section-label mb-5">Nasze Rozwiązania</p>
            <h2 className="heading-section">
              Zaprojektowane i zoptymalizowane
              <br />
              <span className="text-zinc-600">
                pod kątem Twojego zapotrzebowania energetycznego.
              </span>
            </h2>
          </div>
          <p className="body-text max-w-sm md:text-right text-zinc-600">
            Każdy projekt poprzedza bezpłatny audyt techniczny.
            Dobieramy rozwiązania do rzeczywistego zapotrzebowania — nie do katalogu.
          </p>
        </div>

        {/* Cards */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((sol) => {
            const Icon = sol.icon
            return (
              <div
                key={sol.id}
                id={`solution-${sol.id}`}
                className={`solution-card relative flex flex-col p-8 md:p-10 rounded-sm border transition-none ${
                  sol.featured
                    ? 'bg-zinc-900 border-blue-700/60 shadow-[0_0_80px_rgba(29,78,216,0.12)]'
                    : 'bg-zinc-900/40 border-zinc-800'
                }`}
                style={{ willChange: 'transform' }}
              >
                {sol.featured && (
                  <>
                    <div className="absolute -top-px left-8 right-8 h-px bg-blue-600/80" />
                    <span className="absolute -top-3.5 left-8 text-[10px] tracking-[0.18em] uppercase text-blue-400 bg-zinc-900 px-3 py-0.5 border border-blue-800/60 rounded-sm">
                      Najchętniej wybierany
                    </span>
                  </>
                )}

                <div className="mb-6 w-10 h-10 border border-zinc-700 rounded-sm flex items-center justify-center">
                  <Icon size={18} className={sol.featured ? 'text-blue-400' : 'text-zinc-500'} />
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                  {sol.title}
                </h3>
                <p className="text-sm text-zinc-600 mb-8">{sol.description}</p>

                <ul className="space-y-3 mb-10 flex-1">
                  {sol.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-zinc-400">
                      <span className="mt-2 w-1 h-1 rounded-full bg-blue-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#kontakt"
                  className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                    sol.featured
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  Zapytaj o wycenę
                  <ArrowRight size={14} />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
