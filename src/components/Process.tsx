'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Search, Pencil, HardHat, Shield } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const steps = [
  {
    id: 'audit',
    num: '01',
    icon: Search,
    title: 'Audyt techniczny',
    description:
      'Analiza obiektu, zużycia energii, warunków nasłonecznienia i możliwości montażowych. Bezpłatna wizja lokalna i wstępny dobór urządzeń.',
    color: 'bg-amber-100 text-amber-700',
    numColor: 'text-amber-400',
  },
  {
    id: 'project',
    num: '02',
    icon: Pencil,
    title: 'Projekt techniczny',
    description:
      'Pełna dokumentacja instalacji: schematy elektryczne, obliczenia uzysku, projekt zabudowy modułów, kosztorys. Projekt przygotowywany przez uprawnionego projektanta.',
    color: 'bg-sky-100 text-sky-700',
    numColor: 'text-sky-400',
  },
  {
    id: 'install',
    num: '03',
    icon: HardHat,
    title: 'Profesjonalny montaż',
    description:
      'Realizacja przez własne, certyfikowane ekipy. Prace elektryczne prowadzone przez elektryków z uprawnieniami SEP. Montaż zgodny z normami PN-EN.',
    color: 'bg-emerald-100 text-emerald-700',
    numColor: 'text-emerald-400',
  },
  {
    id: 'care',
    num: '04',
    icon: Shield,
    title: 'Opieka pogwarancyjna',
    description:
      'Monitoring pracy instalacji, przeglądy gwarancyjne i pogwarancyjne, serwis urządzeń, aktualizacje oprogramowania falowników i systemów zarządzania.',
    color: 'bg-violet-100 text-violet-700',
    numColor: 'text-violet-400',
  },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Use autoAlpha so elements are always visible if animation doesn't fire
    gsap.set(headerRef.current, { autoAlpha: 1 })
    gsap.from(headerRef.current, {
      autoAlpha: 0, y: 40, duration: 0.75, ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none', // never reverse — stays visible
      },
    })

    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.step-card')
    if (cards && cards.length) {
      gsap.set(cards, { autoAlpha: 1 })
      gsap.from(cards, {
        autoAlpha: 0, y: 60, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="proces"
      className="py-10 md:py-24 relative bg-white"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div ref={headerRef} className="mb-10 md:mb-20">
          <p className="section-label mb-5">Standardy inżynieryjne</p>
          <h2 className="heading-section max-w-2xl">
            Proces realizacji:
            <br />
            <span className="text-slate-500">od audytu do opieki pogwarancyjnej</span>
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                id={`step-${step.id}`}
                className="step-card relative p-9 md:p-10 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
              >
                {/* Connector line (hidden on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-14 -right-3 w-6 h-px bg-slate-200 z-10" />
                )}

                <div className={`step-num text-xs font-black tracking-[0.3em] ${step.numColor} mb-7`}>
                  {step.num}
                </div>

                <div className={`mb-7 w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <Icon size={20} />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
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
