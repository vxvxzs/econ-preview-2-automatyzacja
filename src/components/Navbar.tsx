'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Leaf, Menu, X, Phone } from 'lucide-react'

interface Props { onOpenQuiz: () => void }

gsap.registerPlugin(ScrollTrigger, useGSAP)

const navItems = [
  { label: 'Usługi',   href: '#uslugi' },
  { label: 'Systemy',  href: '#systemy' },
  { label: 'Proces',   href: '#proces' },
  { label: 'O firmie', href: '#firma' },
  { label: 'Kontakt',  href: '#kontakt' },
]

export default function Navbar({ onOpenQuiz }: Props) {
  const headerRef = useRef<HTMLElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useGSAP(() => {
    gsap.set(headerRef.current, { y: -80, opacity: 0 })
    gsap.to(headerRef.current, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 })

    ScrollTrigger.create({
      start: 'top -60',
      onEnter: () => {
        setScrolled(true)
        gsap.to(headerRef.current, {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255,255,255,0.92)',
          boxShadow: '0 1px 0 rgba(16,185,129,0.08), 0 4px 24px rgba(0,0,0,0.06)',
          duration: 0.35,
        })
      },
      onLeaveBack: () => {
        setScrolled(false)
        gsap.to(headerRef.current, {
          backdropFilter: 'blur(0px)',
          backgroundColor: 'rgba(255,255,255,0)',
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          duration: 0.35,
        })
      },
    })
  }, { scope: headerRef })

  useEffect(() => {
    const el = mobileRef.current
    if (!el) return
    if (mobileOpen) {
      gsap.fromTo(el,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out', display: 'block' }
      )
    } else {
      gsap.to(el, {
        opacity: 0, y: -8, duration: 0.18, ease: 'power2.in',
        onComplete: () => gsap.set(el, { display: 'none' }),
      })
    }
  }, [mobileOpen])

  return (
    <>
      <header
        ref={headerRef}
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
        style={{ willChange: 'transform, opacity' }}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" id="nav-logo" className="inline-flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf size={15} className="text-white fill-white" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900">
              ECON <span className="text-slate-400 font-normal">FOTOWOLTAIKA</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-slate-600 hover:text-emerald-600 transition-colors duration-200 tracking-wide font-medium"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+48000000000"
              id="nav-phone"
              className="hidden md:inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <Phone size={13} />
              Zadzwoń teraz
            </a>
            <button
              onClick={onOpenQuiz}
              id="nav-cta"
              className="hidden md:inline-flex btn-primary text-sm px-5 py-2.5 rounded-xl"
            >
              Wyceń system
            </button>
            <button
              id="nav-hamburger"
              className="md:hidden text-slate-500 hover:text-emerald-600 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        ref={mobileRef}
        style={{ display: 'none' }}
        className="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 md:hidden shadow-lg"
      >
        <ul className="flex flex-col px-6 py-4 gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm text-slate-600 hover:text-emerald-600 border-b border-slate-50 transition-colors font-medium"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-4 pb-2">
            <button
              onClick={() => { setMobileOpen(false); onOpenQuiz() }}
              className="btn-primary w-full justify-center text-sm rounded-xl"
            >
              Darmowa wycena
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}
