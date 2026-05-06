'use client'

import { useRef } from 'react'
import Image from 'next/image'
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
    image: '/solar_panels_closeup.png',
    cols: 'lg:col-span-2',
    accent: 'from-amber-50 to-white',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
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
    image: '/heat_pump_modern.png',
    cols: '',
    accent: 'from-sky-50 to-white',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
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
    image: '/energy_storage_premium.png',
    cols: '',
    accent: 'from-emerald-50 to-white',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
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
    image: '/technician_professional.png',
    cols: 'lg:col-span-2',
    accent: 'from-violet-50 to-white',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
]

export default function Services() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const isMobile = window.innerWidth < 768

    gsap.set(headerRef.current, { autoAlpha: 1 })
    gsap.from(headerRef.current, {
      autoAlpha: 0, y: 30, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: headerRef.current, ...ST_DEFAULTS },
    })

    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.service-card')
    if (cards && cards.length) {
      gsap.set(cards, { autoAlpha: 1 })
      gsap.from(cards, {
        autoAlpha: 0,
        y: isMobile ? 30 : 60,
        // Skip scale on mobile — forces compositing layer per card
        scale: isMobile ? 1 : 0.97,
        duration: 0.7,
        stagger: isMobile ? 0.06 : 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, ...ST_DEFAULTS },
      })

      // Hover effects — desktop only (touch devices don't benefit)
      if (!isMobile) {
        cards.forEach((card) => {
          const img = card.querySelector<HTMLElement>('.card-img')
          card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -4, boxShadow: '0 20px 60px rgba(16,185,129,0.12)', duration: 0.3, ease: 'power2.out' })
            if (img) gsap.to(img, { opacity: 0.9, scale: 1.06, duration: 0.5, ease: 'power2.out' })
          })
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', duration: 0.35, ease: 'power2.inOut' })
            if (img) gsap.to(img, { opacity: 0.3, scale: 1, duration: 0.5, ease: 'power2.inOut' })
          })
        })
      }
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="uslugi" className="py-10 md:py-28 relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-10 md:mb-16">
          <p className="section-label mb-5">Zakres usług</p>
          <h2 className="heading-section max-w-xl">
            Pełny zakres inżynierii{' '}
            <span className="text-emerald-600">systemów OZE</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((svc) => {
            const Icon = svc.icon
            return (
              <div
                key={svc.id}
                id={`service-${svc.id}`}
                className={`service-card ${svc.cols} relative p-7 md:p-10 bg-white rounded-3xl border border-slate-100 cursor-default shadow-sm overflow-hidden`}
              >
                {/* Background image — lazy loaded, these are below the fold */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <Image
                    src={svc.image}
                    alt=""
                    aria-hidden="true"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="card-img object-cover opacity-[0.3]"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${svc.accent} via-white/60`} />
                </div>

                <div className="relative z-10">
                  <div className={`mb-6 inline-flex items-center justify-center w-11 h-11 ${svc.iconBg} rounded-2xl shadow-sm`}>
                    <Icon size={20} className={svc.iconColor} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {svc.description}
                  </p>
                  <ul className="space-y-2">
                    {svc.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
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
