'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { MapPin, Building2, Users, Clock } from 'lucide-react'
import { ST_DEFAULTS } from '@/lib/gsap-utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const facts = [
  {
    id: 'local',
    icon: Building2,
    title: 'Lokalny, stabilny podmiot',
    description:
      'Działamy od ponad 10 lat. Posiadamy stałą siedzibę, warsztaty serwisowe i własne magazyny sprzętu w Kielcach. Jesteśmy tu na stałe — nie centrum zgłoszeniowe.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'crews',
    icon: Users,
    title: 'Własne ekipy montażowe',
    description:
      'Nie podzlecamy montażu firmom zewnętrznym. Wszystkie prace realizują nasi pracownicy z uprawnieniami elektrycznymi SEP i zaświadczeniami montażowymi.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'service',
    icon: Clock,
    title: 'Serwis po sprzedaży',
    description:
      'Przeglądy, reakcja serwisowa, monitoring zdalny. Nasz serwis nie kończy się na protokole odbioru — oferujemy długoterminową opiekę techniczną.',
    color: 'bg-sky-100 text-sky-700',
  },
]

export default function LocalAuthority() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const isMobile = window.innerWidth < 768

    // Guarantee visibility — if ScrollTrigger misfires, content is never hidden
    gsap.set([leftRef.current, rightRef.current], { autoAlpha: 1 })

    gsap.from(leftRef.current, {
      autoAlpha: 0, x: isMobile ? 0 : -50, y: isMobile ? 30 : 0,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: leftRef.current, ...ST_DEFAULTS },
    })

    const cards = rightRef.current?.querySelectorAll<HTMLElement>('.fact-card')
    if (cards && cards.length) {
      gsap.set(cards, { autoAlpha: 1 })
      gsap.from(cards, {
        autoAlpha: 0, x: isMobile ? 0 : 40, y: isMobile ? 25 : 0,
        duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: rightRef.current, ...ST_DEFAULTS },
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="firma"
      className="py-10 md:py-28 relative overflow-hidden bg-slate-50/60"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/house_solar_aerial.png"
          alt=""
          aria-hidden="true"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover opacity-[0.05]"
          style={{ objectPosition: 'center 30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">

          {/* Left */}
          <div ref={leftRef}>
            <p className="section-label mb-5">O firmie</p>
            <h2 className="heading-section mb-6 md:mb-8">
              Świętokrzyskie.
              <br />
              <span className="text-slate-500">
                Lokalna firma,
                <br />
                nie infolinia.
              </span>
            </h2>
            <p className="body-text mb-6 text-slate-600">
              Econ Fotowoltaika to firma z Kielc specjalizująca się w projektowaniu
              i realizacji instalacji odnawialnych źródeł energii w województwie
              świętokrzyskim i regionach ościennych.
            </p>
            <p className="body-text mb-8 md:mb-10 text-slate-600">
              Działamy lokalnie — znamy specyfikę tutejszego budownictwa,
              warunki klimatyczne i operatorów sieci dystrybucyjnej. Każdy projekt
              traktujemy indywidualnie, a nie jako pozycję w planie sprzedaży.
            </p>

            {/* Address */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-10 h-10 border border-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 bg-emerald-50 shadow-sm">
                  <MapPin size={16} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 tracking-widest uppercase mb-2">Siedziba</div>
                  <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                    ul. Piekoszowska 363
                    <br />
                    25-645 Kielce
                  </div>
                  <div className="mt-3 text-xs text-slate-500">Województwo Świętokrzyskie</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — facts */}
          <div ref={rightRef} className="space-y-4">
            {facts.map((fact) => {
              const Icon = fact.icon
              return (
                <div
                  key={fact.id}
                  className="fact-card flex gap-5 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className={`mt-0.5 w-11 h-11 ${fact.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">{fact.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{fact.description}</p>
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
