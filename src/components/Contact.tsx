'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
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
    gsap.from(leftRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: leftRef.current, ...ST_DEFAULTS },
    })
    gsap.from(rightRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.85,
      delay: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: rightRef.current, ...ST_DEFAULTS },
    })
  }, { scope: sectionRef })

  const inputCls =
    'w-full bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-blue-700 transition-colors duration-200'

  // Button hover punch
  const onBtnEnter = () =>
    gsap.to(btnRef.current, { scale: 1.04, duration: 0.2, ease: 'back.out(1.7)' })
  const onBtnLeave = () =>
    gsap.to(btnRef.current, { scale: 1, duration: 0.25, ease: 'power2.inOut' })

  return (
    <section
      ref={sectionRef}
      id="kontakt"
      className="py-28 bg-black border-t border-zinc-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left */}
          <div ref={leftRef}>
            <p className="section-label mb-5">Kontakt</p>
            <h2 className="heading-section mb-6">
              Zamów konsultację
              <br />
              <span className="text-zinc-600">techniczną</span>
            </h2>
            <p className="body-text mb-10 text-zinc-500">
              Opisz swój obiekt i potrzeby energetyczne. Nasz inżynier
              skontaktuje się z Tobą, aby umówić bezpłatną wizję lokalną
              i omówić optymalny dobór systemu.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 border border-zinc-800 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Mail size={13} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-600 tracking-widest uppercase mb-1">E-mail</div>
                  <a
                    href="mailto:econpoland@gmail.com"
                    className="text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    econpoland@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 border border-zinc-800 rounded-sm flex items-center justify-center flex-shrink-0">
                  <MapPin size={13} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-600 tracking-widest uppercase mb-1">Siedziba</div>
                  <div className="text-sm text-zinc-300">ul. Piekoszowska 363, 25-645 Kielce</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div ref={rightRef}>
            {status === 'sent' ? (
              <div className="h-full flex items-center justify-center border border-zinc-800 rounded-sm p-12 text-center bg-zinc-950">
                <div>
                  <div className="text-3xl mb-4 text-blue-500">✓</div>
                  <h3 className="text-lg font-bold text-white mb-2">Zapytanie wysłane</h3>
                  <p className="text-sm text-zinc-600">Odpowiemy w ciągu 24 godzin roboczych.</p>
                </div>
              </div>
            ) : (
              <form
                id="contact-form"
                onSubmit={handleSubmit}
                className="space-y-5 border border-zinc-800 rounded-sm p-8 md:p-10 bg-zinc-950"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[10px] text-zinc-600 tracking-widest uppercase mb-2">
                      Imię i nazwisko
                    </label>
                    <input id="name" name="name" type="text" required
                      placeholder="Jan Kowalski" value={form.name} onChange={handleChange}
                      className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] text-zinc-600 tracking-widest uppercase mb-2">
                      Telefon
                    </label>
                    <input id="phone" name="phone" type="tel" required
                      placeholder="+48 500 000 000" value={form.phone} onChange={handleChange}
                      className={inputCls} />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-[10px] text-zinc-600 tracking-widest uppercase mb-2">
                    Lokalizacja montażu
                  </label>
                  <input id="location" name="location" type="text" required
                    placeholder="Kielce, gmina Morawica..." value={form.location} onChange={handleChange}
                    className={inputCls} />
                </div>

                <div>
                  <label htmlFor="bill" className="block text-[10px] text-zinc-600 tracking-widest uppercase mb-2">
                    Średni miesięczny rachunek za energię (zł)
                  </label>
                  <input id="bill" name="bill" type="number" min="0"
                    placeholder="np. 400" value={form.bill} onChange={handleChange}
                    className={inputCls} />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-[10px] text-zinc-600 tracking-widest uppercase mb-2">
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
                  <label htmlFor="message" className="block text-[10px] text-zinc-600 tracking-widest uppercase mb-2">
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
                  className="w-full btn-primary justify-center py-4 text-sm disabled:opacity-60"
                  style={{ willChange: 'transform' }}
                >
                  {status === 'sending' ? 'Wysyłanie...' : (
                    <><span>Wyślij zapytanie</span><ArrowRight size={15} /></>
                  )}
                </button>

                <p className="text-xs text-zinc-700 text-center">
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
