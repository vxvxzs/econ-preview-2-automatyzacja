'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, MapPin, ChevronDown, Zap, Leaf, TrendingDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function parseStat(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/)
  return match ? { num: parseInt(match[1], 10), suffix: match[2] } : { num: 0, suffix: '' }
}

const stats = [
  { value: '500+', label: 'Zrealizowanych instalacji' },
  { value: '10+',  label: 'Lat w branży OZE' },
  { value: '100%', label: 'Własne ekipy montażowe' },
]

interface Props {
  onOpenQuiz: () => void
}

export default function Hero({ onOpenQuiz }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef   = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const isMobile = window.innerWidth < 768

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from(badgeRef.current, { opacity: 0, y: 20, duration: 0.5 }, 0.1)

    if (headingRef.current) {
      const lines = headingRef.current.querySelectorAll<HTMLElement>('span.block')
      if (lines.length) {
        // On mobile: skip expensive blur filter — simple opacity/y only
        tl.from(lines, {
          opacity: 0,
          y: isMobile ? 20 : 35,
          filter: isMobile ? 'none' : 'blur(10px)',
          duration: isMobile ? 0.55 : 0.75,
          stagger: 0.08,
        }, 0.25)
      }
    }
    tl.from(subRef.current,   { autoAlpha: 0, y: 20, duration: 0.55 }, '-=0.3')
    tl.from(ctaRef.current,   { autoAlpha: 0, y: 16, duration: 0.45 }, '-=0.3')
    
    // Stats start hidden and only appear/animate after a slight scroll (75% of viewport)
    const statEls = statsRef.current?.querySelectorAll<HTMLElement>('.stat-number')
    if (statEls && statEls.length) {
      // Hide initially for the scroll-trigger reveal
      gsap.set(statsRef.current, { autoAlpha: 0, y: 30 })
      
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%', // Triggers after a bit of scrolling
        once: true,
        onEnter: () => {
          // Reveal the strip
          gsap.to(statsRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' })
          
          // Start counting
          statEls.forEach((el) => {
            const target = parseInt(el.dataset.target ?? '0', 10)
            const suffix = el.dataset.suffix ?? ''
            const obj = { val: 0 }
            
            gsap.to(obj, {
              val: target,
              duration: 2,
              ease: 'power3.out',
              roundProps: 'val',
              onUpdate: () => { el.textContent = obj.val + suffix },
            })
          })
        }
      })
    }
    
    ScrollTrigger.refresh()
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-white"
    >
      {/* Background image — priority for LCP */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/hero_solar_landscape.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.09]"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-white" />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 z-0 opacity-[0.022] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      {/* Glows — position: absolute (not fixed) so they don't repaint on scroll */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-emerald-400/[0.07] blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-amber-300/[0.07] blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 pt-20 pb-16 md:pt-32 md:pb-28 text-center">

        {/* Location badge */}
        <div ref={badgeRef} className="mb-6 md:mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 text-xs text-emerald-700 tracking-[0.2em] uppercase border border-emerald-200 rounded-full px-5 py-2.5 bg-emerald-50/80 shadow-sm font-bold">
            <MapPin size={11} className="text-emerald-500" />
            Kielce · Województwo Świętokrzyskie
          </span>
        </div>

        {/* OZE badge */}
        <div className="mb-6 md:mb-7 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
          <Zap size={13} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-amber-700 tracking-wide uppercase">Lider OZE w Świętokrzyskim</span>
        </div>

        {/* Main heading */}
        <h1 ref={headingRef} className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-black tracking-tightest leading-[0.94] text-slate-900 mb-7 md:mb-8">
          <span className="block">Inżynieria</span>
          <span className="block text-emerald-600">Odnawialnych</span>
          <span className="block">Źródeł Energii</span>
        </h1>

        {/* Subtext */}
        <p ref={subRef} className="body-lead max-w-2xl mx-auto mb-8 md:mb-10 text-slate-600">
          Profesjonalne instalacje fotowoltaiczne i systemy grzewcze
          dla domów oraz przemysłu w Kielcach i regionie.
          <span className="text-slate-700 block mt-3 text-base font-semibold">
            Solidna inżynieria · Własne ekipy · Serwis gwarancyjny i pogwarancyjny
          </span>
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap justify-center gap-4 mb-12 md:mb-28">
          <button
            id="hero-cta-quiz"
            onClick={onOpenQuiz}
            className="btn-primary text-base px-10 py-5 text-lg font-bold"
          >
            <Leaf size={18} />
            Zamów bezpłatną wycenę
            <ArrowRight size={18} />
          </button>
          <a href="#kalkulator" id="hero-cta-calc" className="btn-outline text-base px-8 py-5">
            <TrendingDown size={17} />
            Oblicz oszczędności
          </a>
        </div>

        {/* Stats strip */}
        <div ref={statsRef} className="border-t border-slate-100 pt-8 md:pt-10 grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto">
          {stats.map((s) => {
            const { num, suffix } = parseStat(s.value)
            return (
              <div key={s.label}>
                <div
                  className="stat-number text-4xl md:text-5xl font-black text-emerald-700 tracking-tightest mb-2 tabular-nums"
                  data-target={num}
                  data-suffix={suffix}
                >
                  {num}{suffix}
                </div>
                <div className="text-xs text-slate-500 leading-snug font-bold uppercase tracking-wider">{s.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
