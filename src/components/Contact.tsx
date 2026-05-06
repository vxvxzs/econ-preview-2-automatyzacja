'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react'
import { ChangeEvent, FormEvent } from 'react'
import { ST_DEFAULTS } from '@/lib/gsap-utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)
  const btnRef     = useRef<HTMLButtonElement>(null)

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [form, setForm] = useState({
    name: '', phone: '', location: '', bill: '', interest: '', message: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1800))
    setStatus('sent')
  }

  useGSAP(() => {
    gsap.set([leftRef.current, rightRef.current], { autoAlpha: 1 })
    gsap.from(leftRef.current, {
      autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: leftRef.current, ...ST_DEFAULTS },
    })
    gsap.from(rightRef.current, {
      autoAlpha: 0, y: 50, duration: 0.85, delay: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: rightRef.current, ...ST_DEFAULTS },
    })
  }, { scope: sectionRef })

  const inputCls =
    'w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-emerald-400 transition-colors duration-200'

  const onBtnEnter = () =>
    gsap.to(btnRef.current, { scale: 1.04, duration: 0.2, ease: 'back.out(1.7)' })
  const onBtnLeave = () =>
    gsap.to(btnRef.current, { scale: 1, duration: 0.25, ease: 'power2.inOut' })

  return (
    <section
      ref={sectionRef}
      id="kontakt"
      className="py-10 md:py-28 border-t border-slate-100 relative overflow-hidden bg-white"
    >
      {/* Background emerald glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-emerald-50/60 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[300px] rounded-full bg-amber-50/40 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left */}
          <div ref={leftRef}>
            <p className="section-label mb-5">Kontakt</p>
            <h2 className="heading-section mb-6">
              Zamów konsultację
              <br />
              <span className="text-slate-500">techniczną</span>
            </h2>
            <p className="body-text mb-10 text-slate-600">
              Opisz swój obiekt i potrzeby energetyczne. Nasz inżynier
              skontaktuje się z Tobą, aby umówić bezpłatną wizję lokalną
              i omówić optymalny dobór systemu.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="mt-0.5 w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 tracking-widest uppercase mb-1">E-mail</div>
                  <a
                    href="mailto:econpoland@gmail.com"
                    className="text-sm text-slate-700 hover:text-emerald-600 transition-colors font-medium"
                  >
                    econpoland@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="mt-0.5 w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={15} className="text-amber-600" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 tracking-widest uppercase mb-1">Siedziba</div>
                  <div className="text-sm text-slate-700 font-medium">ul. Piekoszowska 363, 25-645 Kielce</div>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-3">
              {['Bezpłatna wycena', 'Bez zobowiązań', 'Odpowiedź w 24h', 'Dofinansowania'].map(badge => (
                <span key={badge} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div ref={rightRef}>
            {status === 'sent' ? (
              <div className="h-full flex items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
                <div>
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Zapytanie wysłane</h3>
                  <p className="text-sm text-slate-600">Odpowiemy w ciągu 24 godzin roboczych.</p>
                </div>
              </div>
            ) : (
              <form
                id="contact-form"
                onSubmit={handleSubmit}
                className="space-y-5 bg-white rounded-3xl border border-slate-100 p-8 md:p-10 shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[10px] text-slate-400 tracking-widest uppercase mb-2">
                      Imię i nazwisko
                    </label>
                    <input id="name" name="name" type="text" required
                      placeholder="Jan Kowalski" value={form.name} onChange={handleChange}
                      className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] text-slate-400 tracking-widest uppercase mb-2">
                      Telefon
                    </label>
                    <input id="phone" name="phone" type="tel" required
                      placeholder="+48 500 000 000" value={form.phone} onChange={handleChange}
                      className={inputCls} />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-[10px] text-slate-400 tracking-widest uppercase mb-2">
                    Lokalizacja montażu
                  </label>
                  <input id="location" name="location" type="text" required
                    placeholder="Kielce, gmina Morawica..." value={form.location} onChange={handleChange}
                    className={inputCls} />
                </div>

                <div>
                  <label htmlFor="bill" className="block text-[10px] text-slate-400 tracking-widest uppercase mb-2">
                    Średni miesięczny rachunek za energię (zł)
                  </label>
                  <input id="bill" name="bill" type="number" min="0"
                    placeholder="np. 400" value={form.bill} onChange={handleChange}
                    className={inputCls} />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-[10px] text-slate-400 tracking-widest uppercase mb-2">
                    Obszar zainteresowania
                  </label>
                  <select id="interest" name="interest" value={form.interest} onChange={handleChange}
                    className={inputCls}>
                    <option value="">-- Wybierz obszar zainteresowania --</option>
                    <option value="pv">Tylko instalacja fotowoltaiczna</option>
                    <option value="pv-hp">Fotowoltaika + Pompa Ciepła</option>
                    <option value="full">Pełny system z Magazynem Energii</option>
                    <option value="service">Serwis istniejącej instalacji / Inne</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] text-slate-400 tracking-widest uppercase mb-2">
                    Dodatkowe informacje (opcjonalnie)
                  </label>
                  <textarea id="message" name="message" rows={3}
                    placeholder="Typ dachu, moc przyłącza, pytania techniczne..."
                    value={form.message} onChange={handleChange}
                    className={inputCls + ' resize-none'} />
                </div>

                <button
                  ref={btnRef}
                  id="form-submit"
                  type="submit"
                  disabled={status === 'sending'}
                  onMouseEnter={onBtnEnter}
                  onMouseLeave={onBtnLeave}
                  className="w-full btn-primary justify-center py-4 text-sm font-bold disabled:opacity-60"
                >
                  {status === 'sending' ? 'Wysyłanie...' : (
                    <><span>Wyślij zapytanie</span><ArrowRight size={15} /></>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Odpowiadamy w ciągu 24 godzin roboczych. Bez zobowiązań.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
