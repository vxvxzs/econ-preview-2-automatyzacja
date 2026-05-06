'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import {
  X, ArrowRight, Sun, Thermometer, Battery, Layers,
  Home, Building2, Factory, HardHat, ChevronLeft,
  CheckCircle2, Leaf, AlertCircle, Loader2
} from 'lucide-react'

// ─── Webhook endpoint ────────────────────────────────────────────────────────
const WEBHOOK_URL = 'https://hook.eu1.make.com/tb54revtmrysngk7ksdmc88cj5vfike2'

// ─── Formatting helpers ──────────────────────────────────────────────────────
const formatNow = () => {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const d = pad(now.getDate())
  const m = pad(now.getMonth() + 1)
  const y = now.getFullYear()
  const h = pad(now.getHours())
  const min = pad(now.getMinutes())
  return `${d}.${m}.${y} ${h}.${min}`
}

// ─── Validation helpers ───────────────────────────────────────────────────────
function validatePhone(v: string) { return v.replace(/\D/g, '').length >= 9 }
function validatePostal(v: string) { return /^\d{2}-\d{3}$/.test(v.trim()) }

// ─── Savings calculation helpers ────────────────────────────────────────────
export function calcSavings(monthlyBill: number) {
  const annual = monthlyBill * 12
  const systemCost = Math.round((monthlyBill / 400) * 28000 / 1000) * 1000  // ~28k for 400zł/mo
  const dotacja = Math.min(Math.round(systemCost * 0.22), 20000)          // Czyste Powietrze ~22%, max 20k
  const netCost = systemCost - dotacja
  const annualSave = Math.round(annual * 0.85)                              // ~85% bill reduction
  const payback = +(netCost / annualSave).toFixed(1)
  const lifeReturn = Math.round(annualSave * 25 - netCost)                  // 25y life
  return { annual, systemCost, dotacja, netCost, annualSave, payback, lifeReturn }
}

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4

interface FormState {
  investment: string
  billMonthly: number
  location: string
  roofType: string
  name: string
  phone: string
  postal: string
}

// ─── Step data ────────────────────────────────────────────────────────────────
const INVESTMENTS = [
  { id: 'pv', icon: Sun, label: 'Fotowoltaika', sub: 'Energia ze słońca' },
  { id: 'hp', icon: Thermometer, label: 'Pompa ciepła', sub: 'Ekologiczne ogrzewanie' },
  { id: 'storage', icon: Battery, label: 'Magazyn energii', sub: 'Niezależność od sieci' },
  { id: 'full', icon: Layers, label: 'Kompleksowa inwestycja', sub: 'Wszystko w jednym' },
]

const LOCATIONS = [
  { id: 'house', icon: Home, label: 'Dom jednorodzinny' },
  { id: 'barn', icon: Building2, label: 'Budynek gospodarczy' },
  { id: 'company', icon: Factory, label: 'Firma / Obiekt kom.' },
  { id: 'newbuild', icon: HardHat, label: 'Inwestycja w budowie' },
]

const ROOFS = [
  { id: 'pitched', label: 'Dach skośny', emoji: '🏠' },
  { id: 'flat', label: 'Dach płaski', emoji: '🏢' },
  { id: 'ground', label: 'Grunt', emoji: '☀️' },
]

// ─── Psychological insight component ─────────────────────────────────────────
function BillInsight({ monthly }: { monthly: number }) {
  const { annual, annualSave, payback, lifeReturn, dotacja } = calcSavings(monthly)
  if (monthly < 100) return null

  const painLevel = monthly >= 600 ? 'critical' : monthly >= 400 ? 'high' : monthly >= 200 ? 'medium' : 'low'
  const painConfig = {
    critical: { color: 'bg-red-50 border-red-200', icon: 'text-red-500', label: 'Pilne!', dot: 'bg-red-400' },
    high: { color: 'bg-orange-50 border-orange-200', icon: 'text-orange-500', label: 'Wysokie koszty', dot: 'bg-orange-400' },
    medium: { color: 'bg-amber-50 border-amber-200', icon: 'text-amber-500', label: 'Średnie koszty', dot: 'bg-amber-400' },
    low: { color: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-500', label: 'Niskie koszty', dot: 'bg-emerald-400' },
  }[painLevel]

  return (
    <div className={`mt-5 p-4 rounded-2xl border ${painConfig.color} transition-all duration-300`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${painConfig.dot} animate-pulse`} />
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-bold mb-2 ${painConfig.icon}`}>{painConfig.label}</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Tracisz rocznie</div>
              <div className="text-xl font-black text-slate-900">{annual.toLocaleString('pl')} zł</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Możesz zaoszczędzić</div>
              <div className="text-xl font-black text-emerald-700">{annualSave.toLocaleString('pl')} zł/rok</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Zwrot inwestycji</div>
              <div className="text-base font-bold text-slate-700">{payback} lat</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Dofinansowanie</div>
              <div className="text-base font-bold text-sky-600">do {dotacja.toLocaleString('pl')} zł</div>
            </div>
          </div>
          {monthly >= 400 && (
            <div className="mt-3 flex items-start gap-2 bg-white/60 rounded-xl p-2.5">
              <AlertCircle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Przy Twoim rachunku instalacja zwróci się w <strong>{payback} lat</strong> i przez kolejne {25 - payback} lat przyniesie czysty zysk <strong>{(lifeReturn).toLocaleString('pl')} zł</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  prefillBill?: number   // from savings calculator on page
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function QuizModal({ isOpen, onClose, prefillBill }: QuizModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<Step>(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ phone?: string; postal?: string }>({})
  const [form, setForm] = useState<FormState>({
    investment: '', billMonthly: prefillBill ?? 300,
    location: '', roofType: '',
    name: '', phone: '', postal: '',
  })

  // Sync prefill
  useEffect(() => {
    if (prefillBill) {
      setForm(f => ({ ...f, billMonthly: prefillBill }))
      // Skip to step 3 if bill was pre-filled from calculator
      setStep(prefillBill ? 3 : 1)
    }
  }, [prefillBill, isOpen])

  // Re-initialize on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setSubmitted(false)
      if (!prefillBill) {
        setStep(1)
        setForm({ investment: '', billMonthly: 300, location: '', roofType: '', name: '', phone: '', postal: '' })
      }
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
      gsap.fromTo(panelRef.current, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out', delay: 0.1 })
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const closeModal = useCallback(() => {
    gsap.to(panelRef.current, { opacity: 0, y: 20, scale: 0.97, duration: 0.2, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, delay: 0.1, onComplete: onClose })
  }, [onClose])

  // ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeModal])

  const animateStep = useCallback((next: Step) => {
    if (!panelRef.current) return setStep(next)
    const content = panelRef.current.querySelector<HTMLElement>('.quiz-step-content')
    if (!content) return setStep(next)
    gsap.to(content, {
      opacity: 0, x: -20, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setStep(next)
        gsap.fromTo(content, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.28, ease: 'power3.out' })
      }
    })
  }, [])

  const pick = useCallback((key: keyof FormState, val: string | number, next: Step) => {
    setForm(f => ({ ...f, [key]: val }))
    setTimeout(() => animateStep(next), 250)
  }, [animateStep])

  // Slider update: dynamically update CSS var for track fill
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    const pct = ((val - 50) / (1500 - 50)) * 100
    e.target.style.setProperty('--pct', `${pct}%`)
    setForm(f => ({ ...f, billMonthly: val }))
  }

  // ─── Webhook submit ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { phone?: string; postal?: string } = {}
    if (!validatePhone(form.phone)) newErrors.phone = 'Podaj min. 9 cyfr'
    if (!validatePostal(form.postal)) newErrors.postal = 'Format: XX-XXX'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setIsSubmitting(true)

    const payload = {
      solutionType: INVESTMENTS.find(i => i.id === form.investment)?.label || form.investment,
      monthlyBill: form.billMonthly,
      buildingType: LOCATIONS.find(l => l.id === form.location)?.label || form.location,
      roofType: ROOFS.find(r => r.id === form.roofType)?.label || (form.roofType || null),
      name: form.name,
      phone: form.phone,
      zipCode: form.postal,
      submittedAt: formatNow(),
    }

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (_) {
      // fail silently — still show success to user
    } finally {
      setIsSubmitting(false)
    }

    // GSAP: fade out form content, reveal success screen
    const stepContent = panelRef.current?.querySelector<HTMLElement>('.quiz-step-content')
    if (stepContent) {
      gsap.to(stepContent, {
        opacity: 0, y: -16, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          setSubmitted(true)
          gsap.fromTo(
            stepContent,
            { opacity: 0, y: 24, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
          )
        },
      })
    } else {
      setSubmitted(true)
    }
  }, [form])

  if (!isOpen) return null

  const progress = submitted ? 100 : step === 1 ? 0 : step === 2 ? 25 : step === 3 ? 50 : 75

  const inputCls = 'w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 placeholder-slate-300 focus:outline-none focus:border-emerald-400 transition-colors'
  const inputErrCls = 'w-full bg-white border-2 border-red-300 rounded-xl px-4 py-3 text-base text-slate-900 placeholder-slate-300 focus:outline-none focus:border-red-400 transition-colors'

  const renderStep = () => {
    if (submitted) return (
      <div className="text-center py-10" ref={successRef}>
        {/* Pulsing ring */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-200 animate-ping opacity-30" />
          <div className="relative w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-emerald-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Dane zostały przesłane! 🎉</h3>
        <p className="text-slate-600 leading-relaxed max-w-sm mx-auto mb-2">
          Analizujemy Twoje oszczędności.
        </p>
        <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
          Nasz doradca oddzwoni w ciągu <strong className="text-slate-900">24h</strong> z gotową symulacją.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {form.investment && <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-3 py-1 rounded-full">{INVESTMENTS.find(i => i.id === form.investment)?.label}</span>}
          <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 font-semibold px-3 py-1 rounded-full">{form.billMonthly} zł/mies.</span>
        </div>
        <button onClick={closeModal} className="mt-8 btn-primary mx-auto">
          Zamknij okno
        </button>
      </div>
    )

    if (step === 1) return (
      <div>
        <p className="text-xs font-bold tracking-[0.22em] uppercase text-emerald-600 mb-1.5">Krok 1 z 4</p>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1.5 leading-snug">
          Na które rozwiązanie chcesz uzyskać dofinansowanie i obniżyć rachunki?
        </h2>
        <p className="text-sm text-slate-500 mb-6">Wybierz obszar – dopasujemy ofertę do Twoich potrzeb.</p>
        <div className="grid grid-cols-2 gap-3">
          {INVESTMENTS.map(inv => {
            const Icon = inv.icon
            const sel = form.investment === inv.id
            return (
              <button key={inv.id} type="button" id={`qm-inv-${inv.id}`}
                onClick={() => pick('investment', inv.id, 2)}
                className={`quiz-tile text-center py-6 ${sel ? 'selected' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1.5 transition-colors ${sel ? 'bg-emerald-500' : 'bg-emerald-50'}`}>
                  <Icon size={22} className={sel ? 'text-white' : 'text-emerald-600'} />
                </div>
                <span className="text-base font-semibold text-slate-800 leading-tight">{inv.label}</span>
                <span className="text-xs text-slate-400">{inv.sub}</span>
              </button>
            )
          })}
        </div>
      </div>
    )

    if (step === 2) {
      const { annual, annualSave, payback, dotacja } = calcSavings(form.billMonthly)
      const sliderPct = ((form.billMonthly - 50) / (1500 - 50)) * 100
      return (
        <div>
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-emerald-600 mb-1.5">Krok 2 z 4</p>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1.5 leading-snug">
            Ile średnio miesięcznie wydajesz na prąd / ogrzewanie?
          </h2>
          <p className="text-sm text-slate-500 mb-6">Przesuń suwak – zobaczymy ile możesz zaoszczędzić.</p>

          {/* Slider */}
          <div className="mb-2">
            <div className="flex justify-between items-end mb-3">
              <span className="text-4xl font-black text-slate-900 tabular-nums">
                {form.billMonthly} <span className="text-2xl text-slate-500">zł/mies.</span>
              </span>
              {form.billMonthly >= 600 && (
                <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full animate-pulse">
                  🔥 Złoty lead
                </span>
              )}
            </div>
            <input
              type="range" min="50" max="1500" step="10"
              value={form.billMonthly}
              onChange={handleSlider}
              className="slider-thumb w-full"
              style={{ '--pct': `${sliderPct}%` } as React.CSSProperties}
              id="qm-bill-slider"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1.5">
              <span>50 zł</span>
              <span>1 500 zł</span>
            </div>
          </div>

          {/* Insight panel */}
          <BillInsight monthly={form.billMonthly} />

          <button
            type="button" id="qm-bill-next"
            onClick={() => animateStep(3)}
            className="btn-primary w-full justify-center mt-5"
          >
            Dalej – wybieram instalację
            <ArrowRight size={17} />
          </button>

          <button onClick={() => animateStep(1)} className="mt-3 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft size={15} /> Wróć
          </button>
        </div>
      )
    }

    if (step === 3) return (
      <div>
        <p className="text-xs font-bold tracking-[0.22em] uppercase text-emerald-600 mb-1.5">Krok 3 z 4</p>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1.5 leading-snug">
          Gdzie planujesz montaż systemu?
        </h2>
        <p className="text-sm text-slate-500 mb-6">Dobieramy rozwiązanie do warunków technicznych Twojego obiektu.</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {LOCATIONS.map(loc => {
            const Icon = loc.icon
            const sel = form.location === loc.id
            return (
              <button key={loc.id} type="button" id={`qm-loc-${loc.id}`}
                onClick={() => {
                  setForm(f => ({ ...f, location: loc.id, roofType: '' }))
                  if (loc.id !== 'house') setTimeout(() => animateStep(4), 250)
                }}
                className={`quiz-tile text-center py-5 ${sel ? 'selected' : ''}`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1 transition-colors ${sel ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                  <Icon size={20} className={sel ? 'text-white' : 'text-slate-600'} />
                </div>
                <span className="text-sm font-semibold text-slate-800 leading-tight">{loc.label}</span>
              </button>
            )
          })}
        </div>

        {form.location === 'house' && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <p className="text-sm font-bold text-emerald-700 mb-3">Jaki posiadasz rodzaj dachu?</p>
            <div className="grid grid-cols-3 gap-2">
              {ROOFS.map(r => {
                const sel = form.roofType === r.id
                return (
                  <button key={r.id} type="button" id={`qm-roof-${r.id}`}
                    onClick={() => { setForm(f => ({ ...f, roofType: r.id })); setTimeout(() => animateStep(4), 250) }}
                    className={`quiz-tile p-3 ${sel ? 'selected' : ''}`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="text-xs font-semibold text-slate-700 text-center leading-tight">{r.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <button onClick={() => animateStep(prefillBill ? 2 : 2)} className="mt-4 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
          <ChevronLeft size={15} /> Wróć
        </button>
      </div>
    )

    if (step === 4) return (
      <div>
        <p className="text-xs font-bold tracking-[0.22em] uppercase text-emerald-600 mb-1.5">Krok 4 z 4</p>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
          Twój profil kwalifikuje się do wstępnej wyceny i sprawdzenia dotacji.
        </h2>
        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
          Gdzie mamy przesłać <span className="font-bold text-emerald-700">darmową symulację zwrotu z inwestycji</span>?
        </p>
        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {form.investment && <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-3 py-1 rounded-full">{INVESTMENTS.find(i => i.id === form.investment)?.label}</span>}
          <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 font-semibold px-3 py-1 rounded-full">{form.billMonthly} zł/mies.</span>
          {form.location && <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 font-semibold px-3 py-1 rounded-full">{LOCATIONS.find(l => l.id === form.location)?.label}</span>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="qm-name" className="block text-xs text-slate-400 tracking-widest uppercase mb-1.5">Imię</label>
            <input id="qm-name" type="text" required placeholder="Jan"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="qm-phone" className="block text-xs text-slate-400 tracking-widest uppercase mb-1.5">Telefon</label>
              <input id="qm-phone" type="tel" required placeholder="+48 500 000 000"
                value={form.phone}
                onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(v => ({ ...v, phone: undefined })) }}
                className={errors.phone ? inputErrCls : inputCls} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="qm-postal" className="block text-xs text-slate-400 tracking-widest uppercase mb-1.5">Kod pocztowy</label>
              <input id="qm-postal" type="text" required placeholder="25-645"
                value={form.postal}
                onChange={e => { setForm(f => ({ ...f, postal: e.target.value })); setErrors(v => ({ ...v, postal: undefined })) }}
                className={errors.postal ? inputErrCls : inputCls} />
              {errors.postal && <p className="text-xs text-red-500 mt-1">{errors.postal}</p>}
            </div>
          </div>
          <button
            type="submit"
            id="qm-submit"
            disabled={isSubmitting}
            className="w-full btn-primary justify-center py-4 font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 size={17} className="animate-spin" /> Wysyłanie...</>
            ) : (
              <><Leaf size={17} /> Otrzymaj darmową symulację <ArrowRight size={17} /></>
            )}
          </button>
          <p className="text-xs text-slate-400 text-center">Bez zobowiązań · Dane chronione RODO · Odpowiadamy w 24h</p>
        </form>
        <button onClick={() => animateStep(3)} className="mt-3 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
          <ChevronLeft size={15} /> Wróć
        </button>
      </div>
    )
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6"
      style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) closeModal() }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Formularz wyceny"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf size={16} className="text-white fill-white" />
            </div>
            <span className="font-black text-base text-slate-900 tracking-tight">ECON <span className="font-normal text-slate-400">FOTOWOLTAIKA</span></span>
          </div>
          <button onClick={closeModal} id="qm-close" className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors" aria-label="Zamknij">
            <X size={16} className="text-slate-600" />
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="px-7 py-3 flex-shrink-0">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Postęp</span>
              <span className="text-[10px] font-bold text-emerald-600">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step content (scrollable) */}
        <div className="quiz-step-content flex-1 overflow-y-auto px-7 py-5">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
