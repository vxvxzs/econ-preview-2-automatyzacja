'use client'

import { useRef } from 'react'
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
  },
  {
    id: 'crews',
    icon: Users,
    title: 'Własne ekipy montażowe',
    description:
      'Nie podzlecamy montażu firmom zewnętrznym. Wszystkie prace realizują nasi pracownicy z uprawnieniami elektrycznymi SEP i zaświadczeniami montażowymi.',
  },
  {
    id: 'service',
    icon: Clock,
    title: 'Serwis po sprzedaży',
    description:
      'Przeglądy, reakcja serwisowa, monitoring zdalny. Nasz serwis nie kończy się na protokole odbioru — oferujemy długoterminową opiekę techniczną.',
  },
]

export default function LocalAuthority() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Left column slides in from left
    gsap.from(leftRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: leftRef.current, ...ST_DEFAULTS },
    })

    // Fact cards stagger from right
    const cards = rightRef.current?.querySelectorAll<HTMLElement>('.fact-card')
    if (cards && cards.length) {
      gsap.from(cards, {
        opacity: 0,
        x: 40,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: rightRef.current, ...ST_DEFAULTS },
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="firma"
      className="py-28 bg-zinc-950 border-t border-zinc-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div ref={leftRef}>
            <p className="section-label mb-5">O firmie</p>
            <h2 className="heading-section mb-8">
              Świętokrzyskie.
              <br />
              <span className="text-zinc-600">
                Lokalna firma,
                <br />
                nie infolinia.
              </span>
            </h2>
            <p className="body-text mb-6 text-zinc-500">
              Econ Fotowoltaika to firma z Kielc specjalizująca się w projektowaniu
              i realizacji instalacji odnawialnych źródeł energii w województwie
              świętokrzyskim i regionach ościennych.
            </p>
            <p className="body-text mb-10 text-zinc-500">
              Działamy lokalnie — znamy specyfikę tutejszego budownictwa,
              warunki klimatyczne i operatorów sieci dystrybucyjnej. Każdy projekt
              traktujemy indywidualnie, a nie jako pozycję w planie sprzedaży.
            </p>

            {/* Address */}
            <div className="card-dark p-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 border border-zinc-700 rounded-sm flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-600 tracking-widest uppercase mb-2">Siedziba</div>
                  <div className="text-sm font-semibold text-white leading-relaxed">
                    ul. Piekoszowska 363
                    <br />
                    25-645 Kielce
                  </div>
                  <div className="mt-3 text-xs text-zinc-600">Województwo Świętokrzyskie</div>
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
                  className="fact-card flex gap-5 p-6 card-glass hover:border-zinc-700 transition-colors duration-300"
                >
                  <div className="mt-0.5 w-9 h-9 border border-zinc-700 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">{fact.title}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">{fact.description}</p>
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
