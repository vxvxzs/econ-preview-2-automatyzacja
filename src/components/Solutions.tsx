'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Sun, Flame, BatteryFull, ArrowRight, Star } from 'lucide-react'
import { ST_DEFAULTS } from '@/lib/gsap-utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Props { onOpenQuiz: () => void }

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
    gradient: 'from-amber-50 to-orange-50',
    badge: '',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
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
    gradient: 'from-emerald-600 to-emerald-800',
    badge: 'Najchętniej wybierany',
    iconColor: 'text-white',
    iconBg: 'bg-white/20',
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
    gradient: 'from-sky-50 to-blue-50',
    badge: '',
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-100',
  },
]

export default function Solutions({ onOpenQuiz }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const isMobile = window.innerWidth < 768

    gsap.set(headerRef.current, { autoAlpha: 1 })
    gsap.from(headerRef.current, {
      autoAlpha: 0, y: 30, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: headerRef.current, ...ST_DEFAULTS },
    })

    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.solution-card')
    if (cards && cards.length) {
      gsap.set(cards, { autoAlpha: 1 })
      gsap.fromTo(cards,
        { autoAlpha: 0, y: isMobile ? 25 : 50, scale: isMobile ? 1 : 0.97 },
        {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 0.7,
          stagger: isMobile ? 0.06 : 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, ...ST_DEFAULTS },
        }
      )
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="systemy"
      className="py-10 md:py-28 relative overflow-hidden bg-slate-50/50"
    >
      {/* Subtle BG decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/house_solar_aerial.png"
          alt=""
          aria-hidden="true"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover opacity-[0.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white/50 to-white/80" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6"
        >
          <div>
            <p className="section-label mb-5">Nasze Rozwiązania</p>
            <h2 className="heading-section">
              Zaprojektowane i zoptymalizowane
              <br />
              <span className="text-slate-500">
                pod kątem Twojego zapotrzebowania energetycznego.
              </span>
            </h2>
          </div>
          <p className="body-text max-w-sm md:text-right text-slate-500">
            Każdy projekt poprzedza bezpłatny audyt techniczny.
            Dobieramy rozwiązania do rzeczywistego zapotrzebowania — nie do katalogu.
          </p>
        </div>

        {/* Cards */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {solutions.map((sol) => {
            const Icon = sol.icon
            return (
              <div
                key={sol.id}
                id={`solution-${sol.id}`}
                className={`solution-card relative flex flex-col p-7 md:p-10 rounded-3xl transition-all duration-300 ${
                  sol.featured
                    ? `bg-gradient-to-br ${sol.gradient} shadow-2xl shadow-emerald-200 scale-[1.02] z-10`
                    : `bg-gradient-to-br ${sol.gradient} border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1`
                }`}
              >
                {sol.featured && sol.badge && (
                  <span className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-white bg-emerald-700 px-3 py-1 rounded-full shadow-sm">
                    <Star size={9} className="fill-white" />
                    {sol.badge}
                  </span>
                )}

                <div className={`mb-6 w-12 h-12 ${sol.iconBg} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <Icon size={22} className={sol.iconColor} />
                </div>

                <h3 className={`text-xl font-bold tracking-tight mb-2 ${sol.featured ? 'text-white' : 'text-slate-900'}`}>
                  {sol.title}
                </h3>
                <p className={`text-sm mb-6 md:mb-8 ${sol.featured ? 'text-emerald-100' : 'text-slate-500'}`}>{sol.description}</p>

                <ul className="space-y-3 mb-8 md:mb-10 flex-1">
                  {sol.features.map((f) => (
                    <li key={f} className={`flex items-start gap-3 text-sm ${sol.featured ? 'text-white/90' : 'text-slate-600'}`}>
                      <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${sol.featured ? 'bg-emerald-300' : 'bg-emerald-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onOpenQuiz}
                  className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${
                    sol.featured
                      ? 'text-white hover:text-emerald-200'
                      : 'text-emerald-700 hover:text-emerald-600'
                  }`}
                >
                  Zapytaj o wycenę
                  <ArrowRight size={14} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
