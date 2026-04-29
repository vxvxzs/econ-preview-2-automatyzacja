'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Search, Pencil, HardHat, Shield } from 'lucide-react'
import { ST_DEFAULTS } from '@/lib/gsap-utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const steps = [
  {
    id: 'audit',
    num: '01',
    icon: Search,
    title: 'Audyt techniczny',
    description:
      'Analiza obiektu, zużycia energii, warunków nasłonecznienia i możliwości montażowych. Bezpłatna wizja lokalna i wstępny dobór urządzeń.',
  },
  {
    id: 'project',
    num: '02',
    icon: Pencil,
    title: 'Projekt techniczny',
    description:
      'Pełna dokumentacja instalacji: schematy elektryczne, obliczenia uzysku, projekt zabudowy modułów, kosztorys. Projekt przygotowywany przez uprawnionego projektanta.',
  },
  {
    id: 'install',
    num: '03',
    icon: HardHat,
    title: 'Profesjonalny montaż',
    description:
      'Realizacja przez własne, certyfikowane ekipy. Prace elektryczne prowadzone przez elektryków z uprawnieniami SEP. Montaż zgodny z normami PN-EN.',
  },
  {
    id: 'care',
    num: '04',
    icon: Shield,
    title: 'Opieka pogwarancyjna',
    description:
      'Monitoring pracy instalacji, przeglądy gwarancyjne i pogwarancyjne, serwis urządzeń, aktualizacje oprogramowania falowników i systemów zarządzania.',
  },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Header
    gsap.from(headerRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: { trigger: headerRef.current, ...ST_DEFAULTS },
    })

    // Step cards — stagger from bottom
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.step-card')
    if (cards && cards.length) {
      gsap.from(cards, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, ...ST_DEFAULTS },
      })

      // Number counter animation
      const nums = gridRef.current?.querySelectorAll<HTMLElement>('.step-num')
      if (nums) {
        gsap.from(nums, {
          opacity: 0,
          y: 10,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: gridRef.current, ...ST_DEFAULTS },
        })
      }
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="proces"
      className="py-28 bg-black border-t border-zinc-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div ref={headerRef} className="mb-20">
          <p className="section-label mb-5">Standardy inżynieryjne</p>
          <h2 className="heading-section max-w-2xl">
            Proces realizacji:
            <br />
            <span className="text-zinc-600">od audytu do opieki pogwarancyjnej</span>
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-800 rounded-sm overflow-hidden"
        >
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                id={`step-${step.id}`}
                className="step-card relative p-8 md:p-10 bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800 last:border-0 group hover:bg-zinc-900 transition-colors duration-300"
              >
                {/* Blue accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-blue-600/0 group-hover:bg-blue-600/60 transition-colors duration-300" />

                <div className="step-num text-[10px] font-black tracking-[0.25em] text-zinc-700 mb-6">
                  {step.num}
                </div>

                <div className="mb-6 w-9 h-9 border border-zinc-800 rounded-sm flex items-center justify-center group-hover:border-blue-800 transition-colors duration-300">
                  <Icon size={16} className="text-zinc-700 group-hover:text-blue-500 transition-colors duration-300" />
                </div>

                <h3 className="text-sm font-bold text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
