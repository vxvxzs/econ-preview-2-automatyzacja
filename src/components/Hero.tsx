'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight, MapPin, ChevronDown } from 'lucide-react'
import { splitWords } from '@/lib/gsap-utils'

gsap.registerPlugin(useGSAP)

// Parse "500+" → { num: 500, suffix: '+' }, "100%" → { num: 100, suffix: '%' }
function parseStat(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/)
  return match
    ? { num: parseInt(match[1], 10), suffix: match[2] }
    : { num: 0, suffix: '' }
}

const stats = [
  { value: '500+', label: 'Zrealizowanych instalacji' },
  { value: '10+',  label: 'Lat w branży OZE' },
  { value: '100%', label: 'Własne ekipy montażowe' },
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef   = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Badge fade up
    tl.from(badgeRef.current, { opacity: 0, y: 20, duration: 0.6 }, 0.1)

    // Word-by-word blur reveal on heading
    if (headingRef.current) {
      const words = splitWords(headingRef.current)
      tl.from(
        words,
        {
          opacity: 0,
          y: 30,
          filter: 'blur(12px)',
          duration: 0.8,
          stagger: 0.07,
          ease: 'power3.out',
        },
        0.3
      )
    }

    // Subtext + CTA
    tl.from(subRef.current,   { opacity: 0, y: 24, duration: 0.65 }, '-=0.3')
    tl.from(ctaRef.current,   { opacity: 0, y: 20, duration: 0.55 }, '-=0.4')
    tl.from(statsRef.current, { opacity: 0, duration: 0.5 },         '-=0.2')

    // Number counter animation — runs when statsRef fades in
    const statEls = statsRef.current?.querySelectorAll<HTMLElement>('.stat-number')
    if (statEls) {
      statEls.forEach((el) => {
        const target = parseInt(el.dataset.target ?? '0', 10)
        const suffix = el.dataset.suffix ?? ''
        const obj = { val: 0 }

        tl.to(
          obj,
          {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            roundProps: 'val',
            onUpdate() {
              el.textContent = obj.val + suffix
            },
          },
          // start counting when stats strip becomes visible (overlap with fade-in)
          '-=0.45'
        )
      })
    }

    tl.from(scrollRef.current, { opacity: 0, duration: 0.5 }, '-=0.8')

    // Bounce scroll indicator
    gsap.to(scrollRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.4,
      ease: 'sine.inOut',
      delay: 1.8,
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-black"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/hero_solar.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.12] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Blue glow top-right */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full bg-blue-700/10 blur-[120px] pointer-events-none z-0" />

      {/* Blue glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-blue-900/8 blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 pt-32 pb-24 text-center">
        {/* Location badge */}
        <div ref={badgeRef} className="mb-12 flex justify-center">
          <span className="inline-flex items-center gap-2 text-[10px] text-zinc-500 tracking-[0.2em] uppercase border border-zinc-800 rounded-sm px-4 py-2 bg-zinc-900/50 backdrop-blur-sm">
            <MapPin size={10} className="text-blue-500" />
            Kielce · Województwo Świętokrzyskie
          </span>
        </div>

        {/* Main heading */}
        <h1
          ref={headingRef}
          className="heading-display mb-10 leading-[0.92] mx-auto"
        >
          Inżynieria Odnawialnych Źródeł Energii
        </h1>

        {/* Subtext */}
        <p ref={subRef} className="body-lead max-w-2xl mx-auto mb-12">
          Profesjonalne instalacje fotowoltaiczne i systemy grzewcze
          dla domów oraz przemysłu w Kielcach i regionie.
          <span className="text-zinc-600 block mt-2 text-base">
            Solidna inżynieria · Własne ekipy · Serwis gwarancyjny i pogwarancyjny
          </span>
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap justify-center gap-4 mb-24">
          <a href="#kontakt" id="hero-cta-primary" className="btn-primary">
            Zamów konsultację techniczną
            <ArrowRight size={15} />
          </a>
          <a href="#systemy" id="hero-cta-secondary" className="btn-outline">
            Poznaj nasze systemy
          </a>
        </div>

        {/* Stats strip */}
        <div
          ref={statsRef}
          className="divider pt-10 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {stats.map((s) => {
            const { num, suffix } = parseStat(s.value)
            return (
              <div key={s.label}>
                <div
                  className="stat-number text-3xl md:text-4xl font-black text-white tracking-tightest mb-1 tabular-nums"
                  data-target={num}
                  data-suffix={suffix}
                >
                  0{suffix}
                </div>
                <div className="text-xs text-zinc-600 leading-snug">{s.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ willChange: 'transform' }}
      >
        <ChevronDown size={18} className="text-zinc-700" />
      </div>
    </section>
  )
}
