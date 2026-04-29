'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Sun, Thermometer, Battery, Wrench } from 'lucide-react'
import { ST_DEFAULTS } from '@/lib/gsap-utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const services = [
  {
    id: 'pv',
    icon: Sun,
    title: 'Instalacje Fotowoltaiczne',
    description:
      'Projektujemy i wykonujemy systemy PV dopasowane do profilu zużycia energii obiektu. Pracujemy wyłącznie z komponentami certyfikowanych producentów.',
    details: [
      'Falowniki: Fronius, SMA, Victron Energy',
      'Panele monokrystaliczne klasy A',
      'Zdalny monitoring uzysków i analityka',
      'Dokumentacja przyłączeniowa do OSD',
    ],
    image: '/hero_solar.png',
    cols: 'lg:col-span-2',
  },
  {
    id: 'heat',
    icon: Thermometer,
    title: 'Pompy Ciepła',
    description:
      'Wysokosprawne systemy grzewcze powietrze–woda. Projektowanie doboru mocy, montaż i uruchomienie wraz z integracją z istniejącą instalacją grzewczą.',
    details: [
      'Ogrzewanie + CWU',
      'COP do 5,0 przy A7/W35',
      'Integracja z regulatorami pogodowymi',
      'Wsparcie w programach dofinansowania',
    ],
    image: '/heat_pump.png',
    cols: '',
  },
  {
    id: 'storage',
    icon: Battery,
    title: 'Magazyny Energii',
    description:
      'Przemysłowe systemy magazynowania energii elektrycznej. Praca wyspowa (EPS) – zabezpieczenie obiektu przy zaniku napięcia w sieci.',
    details: [
      'Technologia LFP – wysoka trwałość cykli',
      'Tryb EPS – zasilanie awaryjne',
      'Optymalizacja autokonsumpcji PV',
      'Integracja Smart Home / BMS',
    ],
    image: '/battery_storage.png',
    cols: '',
  },
  {
    id: 'service',
    icon: Wrench,
    title: 'Serwis i Monitoring',
    description:
      'Kompleksowa opieka techniczna przez cały cykl życia instalacji. Reagujemy – nie tylko montujemy.',
    details: [
      'Przeglądy gwarancyjne i pogwarancyjne',
      'Zdalny monitoring parametrów pracy',
      'Czas reakcji serwisowej do 48h',
      'Umowy serwisowe długoterminowe',
    ],
    image: '/inverter_tech.png',
    cols: 'lg:col-span-2',
  },
]

export default function Services() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Header reveal
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

    // Cards stagger with 3D punch
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.service-card')
    if (cards && cards.length) {
      gsap.from(cards, {
        opacity: 0,
        y: 80,
        scale: 0.95,
        rotationX: 10,
        transformPerspective: 800,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          ...ST_DEFAULTS,
        },
      })

      // Hover effects
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>('.card-img')

        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.02,
            borderColor: 'rgba(37,99,235,0.6)',
            boxShadow: '0 0 60px rgba(29,78,216,0.18)',
            duration: 0.3,
            ease: 'power2.out',
          })
          if (img) gsap.to(img, { opacity: 0.22, duration: 0.4 })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            borderColor: 'rgba(39,39,42,1)',
            boxShadow: 'none',
            duration: 0.35,
            ease: 'power2.inOut',
          })
          if (img) gsap.to(img, { opacity: 0.1, duration: 0.4 })
        })
      })
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="uslugi" className="py-28 bg-black glow-blue">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <p className="section-label mb-5">Zakres usług</p>
          <h2 className="heading-section max-w-xl">
            Pełny zakres inżynierii{' '}
            <span className="text-zinc-600">systemów OZE</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/40 border border-zinc-800 rounded-sm overflow-hidden"
        >
          {services.map((svc) => {
            const Icon = svc.icon
            return (
              <div
                key={svc.id}
                id={`service-${svc.id}`}
                className={`service-card ${svc.cols} relative p-8 md:p-10 bg-zinc-900 border border-zinc-800 cursor-default`}
                style={{ willChange: 'transform, box-shadow' }}
              >
                {/* Subtle background image */}
                <div className="absolute inset-0 overflow-hidden rounded-sm">
                  <img
                    src={svc.image}
                    alt=""
                    aria-hidden="true"
                    className="card-img w-full h-full object-cover grayscale opacity-10"
                  />
                </div>

                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center justify-center w-10 h-10 border border-zinc-700 rounded-sm bg-black/60">
                    <Icon size={18} className="text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                    {svc.description}
                  </p>
                  <ul className="space-y-2">
                    {svc.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-xs text-zinc-600">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-600 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
