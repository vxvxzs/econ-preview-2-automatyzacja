'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { TrendingUp, Zap, ArrowRight, Leaf, Sun } from 'lucide-react'
import { calcSavings } from './QuizModal'
import { ST_DEFAULTS } from '@/lib/gsap-utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Props {
  onOpenQuiz: (bill: number) => void
}

export default function SavingsCalculator({ onOpenQuiz }: Props) {
  const sectionRef   = useRef<HTMLElement>(null)
  const headerRef    = useRef<HTMLDivElement>(null)
  const cardRef      = useRef<HTMLDivElement>(null)

  // DOM refs for direct updates — bypasses React state on every slider tick
  const billDisplayRef  = useRef<HTMLSpanElement>(null)
  const badgeDisplayRef = useRef<HTMLDivElement>(null)
  const resultsRef      = useRef<HTMLDivElement>(null)
  const dotacjaAmtRef   = useRef<HTMLSpanElement>(null)
  const dotacjaBigRef   = useRef<HTMLDivElement>(null)

  // Committed state — only updated on slider release (touchend/mouseup)
  const [monthly, setMonthly]   = useState(350)
  const [showCTA, setShowCTA]   = useState(false)

  // RAF throttle ref
  const rafId        = useRef<number | null>(null)
  const pendingVal   = useRef<number>(350)
  const sliderRef    = useRef<HTMLInputElement>(null)

  // Pre-compute savings for committed state (used for initial render + CTA)
  const { annual, annualSave, payback, dotacja, lifeReturn } = calcSavings(monthly)
  const sliderPct = ((monthly - 50) / (1500 - 50)) * 100

  // Color helpers — pure functions
  const getPainColor = (val: number) =>
    val >= 600 ? 'text-red-600' :
    val >= 400 ? 'text-orange-500' :
    val >= 200 ? 'text-amber-500' : 'text-emerald-600'

  const getPainBg = (val: number) =>
    val >= 600 ? 'bg-red-50 border-red-100' :
    val >= 400 ? 'bg-orange-50 border-orange-100' :
    val >= 200 ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'

  const getBadgeText = (val: number) =>
    val < 150 ? '💡 Niskie zużycie' :
    val < 300 ? '📊 Przeciętne zużycie' :
    val < 500 ? '⚡ Ponadprzeciętne zużycie' :
    '🔥 Bardzo wysokie – działaj teraz!'

  // Formats result grid items directly into DOM — no React re-render
  const updateResultsDOM = useCallback((val: number) => {
    const s = calcSavings(val)

    // Update bill display
    if (billDisplayRef.current) {
      const colorClass = getPainColor(val)
      billDisplayRef.current.textContent = String(val)
      billDisplayRef.current.className = `text-5xl md:text-6xl font-black tabular-nums ${colorClass}`
    }
    // Update badge
    if (badgeDisplayRef.current) {
      const colorClass = getPainColor(val)
      const bgClass    = getPainBg(val)
      badgeDisplayRef.current.textContent = getBadgeText(val)
      badgeDisplayRef.current.className = `px-4 py-2 rounded-2xl border text-sm font-bold ${bgClass} ${colorClass}`
    }
    // Update result cards
    if (resultsRef.current) {
      const values = resultsRef.current.querySelectorAll<HTMLElement>('.result-value')
      if (values.length >= 4) {
        values[0].textContent = `${s.annual.toLocaleString('pl')} zł`
        values[1].textContent = `${s.annualSave.toLocaleString('pl')} zł`
        values[2].textContent = `${s.payback} lat`
        values[3].textContent = `${s.lifeReturn.toLocaleString('pl')} zł`
      }
    }
    // Update dotacja
    if (dotacjaAmtRef.current) dotacjaAmtRef.current.textContent = `${s.dotacja.toLocaleString('pl')} zł`
    if (dotacjaBigRef.current) dotacjaBigRef.current.textContent = `-${s.dotacja.toLocaleString('pl')} zł`
  }, [])

  // RAF-throttled handler: direct DOM mutation, max 1 per frame
  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    const pct = ((val - 50) / (1500 - 50)) * 100
    // Update slider fill immediately (CSS custom property — no layout)
    e.target.style.setProperty('--pct', `${pct}%`)
    pendingVal.current = val

    if (rafId.current !== null) return // already scheduled
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      updateResultsDOM(pendingVal.current)
    })
  }, [updateResultsDOM])

  // Commit to React state only on pointer release — triggers CTA logic
  const handleSliderCommit = useCallback(() => {
    const val = pendingVal.current
    setMonthly(val)
    if (val >= 150 && !showCTA) setShowCTA(true)
  }, [showCTA])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  useGSAP(() => {
    gsap.set([headerRef.current, cardRef.current], { autoAlpha: 1 })
    gsap.from(headerRef.current, {
      autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: headerRef.current, start: 'top 88%', toggleActions: 'play none none none' },
    })
    gsap.from(cardRef.current, {
      autoAlpha: 0, y: 50, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: cardRef.current, start: 'top 88%', toggleActions: 'play none none none' },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="kalkulator"
      className="py-8 md:py-24 relative overflow-hidden bg-gradient-to-b from-slate-50/60 to-white"
    >
      {/* Decorative BG glows — absolute (not fixed) */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-emerald-50/70 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-amber-50/50 blur-[80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
            <Sun size={14} className="text-amber-500" />
            <span className="text-sm font-bold text-emerald-700">Kalkulator oszczędności</span>
          </div>
          <h2 className="heading-section mb-5">
            Ile możesz zaoszczędzić{' '}
            <span className="text-emerald-600">na energii?</span>
          </h2>
          <p className="body-lead text-slate-500 max-w-xl mx-auto">
            Przesuń suwak i zobacz realne liczby dla Twojego domu. <strong>Bez rejestracji, bez zobowiązań.</strong>
          </p>
        </div>

        {/* Main calculator card */}
        <div ref={cardRef} className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/80 p-6 md:p-12">
          {/* Slider area */}
          <div className="mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
              <div>
                <p className="text-sm text-slate-500 mb-1">Twój miesięczny rachunek za prąd/ogrzewanie</p>
                <div className="flex items-end gap-2">
                  {/* Direct DOM ref — updated without React state change */}
                  <span
                    ref={billDisplayRef}
                    className={`text-5xl md:text-6xl font-black tabular-nums ${getPainColor(monthly)}`}
                  >
                    {monthly}
                  </span>
                  <span className="text-2xl text-slate-400 mb-1 font-medium">zł/mies.</span>
                </div>
              </div>
              <div
                ref={badgeDisplayRef}
                className={`px-4 py-2 rounded-2xl border text-sm font-bold ${getPainBg(monthly)} ${getPainColor(monthly)}`}
              >
                {getBadgeText(monthly)}
              </div>
            </div>
            <input
              ref={sliderRef}
              type="range" min="50" max="1500" step="10"
              defaultValue={monthly}
              onChange={handleSlider}
              onMouseUp={handleSliderCommit}
              onTouchEnd={handleSliderCommit}
              className="slider-thumb w-full touch-none"
              style={{ '--pct': `${sliderPct}%` } as React.CSSProperties}
              id="calc-slider"
              aria-label="Miesięczny rachunek za energię"
            />
            <div className="flex justify-between text-sm text-slate-400 mt-2">
              <span>50 zł</span>
              <span>1 500 zł</span>
            </div>
          </div>

          {/* Results grid — updated via direct DOM refs */}
          <div ref={resultsRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {[
              { label: 'Roczna strata bez PV', value: `${annual.toLocaleString('pl')} zł`,       sub: 'płacisz dostawcy',   color: 'text-slate-800',  bg: 'bg-slate-50 border-slate-100' },
              { label: 'Oszczędność roczna',   value: `${annualSave.toLocaleString('pl')} zł`,   sub: 'po instalacji',      color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
              { label: 'Zwrot inwestycji',      value: `${payback} lat`,                          sub: 'typowo 7–10 lat',    color: 'text-sky-700',    bg: 'bg-sky-50 border-sky-100' },
              { label: 'Zysk przez 25 lat',    value: `${lifeReturn.toLocaleString('pl')} zł`,   sub: 'po odjęciu kosztów', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-100' },
            ].map(item => (
              <div key={item.label} className={`${item.bg} border rounded-2xl p-4`}>
                <div className="text-xs text-slate-500 mb-1.5 leading-tight">{item.label}</div>
                <div className={`result-value text-xl font-black ${item.color} tabular-nums`}>{item.value}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Dotacja row */}
          <div className="flex items-center gap-4 p-4 bg-sky-50 border border-sky-100 rounded-2xl mb-6 md:mb-8">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap size={18} className="text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-sky-800">Dofinansowanie „Czyste Powietrze"</div>
              <div className="text-xs text-sky-600">
                Przy Twoim rachunku kwalifikujesz się nawet na{' '}
                <strong className="text-sky-800">
                  <span ref={dotacjaAmtRef}>{dotacja.toLocaleString('pl')} zł</span>
                </strong>{' '}
                dofinansowania
              </div>
            </div>
            <div ref={dotacjaBigRef} className="text-2xl font-black text-sky-700 tabular-nums flex-shrink-0">
              -{dotacja.toLocaleString('pl')} zł
            </div>
          </div>

          {/* CTA — Conditional rendering to avoid layout void */}
          {showCTA && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-emerald-600" />
                  <span className="font-bold text-emerald-800">Chcesz poznać dokładną wycenę?</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Twój profil jest gotowy. Wypełnij 2-minutowy formularz i otrzymaj <strong>darmową symulację zwrotu z inwestycji</strong>.
                </p>
                <button
                  id="calc-cta"
                  onClick={() => onOpenQuiz(monthly)}
                  className="btn-primary mx-auto"
                >
                  <Leaf size={16} />
                  Pobierz moją darmową symulację
                  <ArrowRight size={16} />
                </button>
                <p className="text-xs text-slate-400 mt-3">Bez zobowiązań · Twoje dane są bezpieczne</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
