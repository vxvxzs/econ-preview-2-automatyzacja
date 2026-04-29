'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Zap, Menu, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const navItems = [
  { label: 'Usługi',   href: '#uslugi' },
  { label: 'Systemy',  href: '#systemy' },
  { label: 'Proces',   href: '#proces' },
  { label: 'O firmie', href: '#firma' },
  { label: 'Kontakt',  href: '#kontakt' },
]

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useGSAP(() => {
    // Initial state — hidden
    gsap.set(headerRef.current, { y: -80, opacity: 0 })

    // Slide in on load
    gsap.to(headerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2,
    })

    // Glassmorphism on scroll
    ScrollTrigger.create({
      start: 'top -60',
      onEnter: () => {
        gsap.to(headerRef.current, {
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(0,0,0,0.85)',
          borderBottom: '1px solid rgba(39,39,42,0.8)',
          duration: 0.35,
        })
      },
      onLeaveBack: () => {
        gsap.to(headerRef.current, {
          backdropFilter: 'blur(0px)',
          backgroundColor: 'rgba(0,0,0,0)',
          borderBottom: '1px solid rgba(39,39,42,0)',
          duration: 0.35,
        })
      },
    })
  }, { scope: headerRef })

  // Mobile menu animation
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
        opacity: 0,
        y: -8,
        duration: 0.18,
        ease: 'power2.in',
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
            <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center">
              <Zap size={14} className="text-white fill-white" />
            </div>
            <span className="font-black text-sm tracking-tight text-white">
              ECON <span className="text-zinc-500 font-normal">FOTOWOLTAIKA</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-zinc-500 hover:text-white transition-colors duration-200 tracking-wide"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="#kontakt"
              id="nav-cta"
              className="hidden md:inline-flex btn-primary text-xs px-5 py-2.5"
            >
              Konsultacja techniczna
            </a>
            <button
              id="nav-hamburger"
              className="md:hidden text-zinc-400 hover:text-white transition-colors"
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
        className="fixed top-16 inset-x-0 z-40 bg-black/95 backdrop-blur-sm border-b border-zinc-800 md:hidden"
      >
        <ul className="flex flex-col px-6 py-4 gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm text-zinc-300 hover:text-white border-b border-zinc-800/60 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-4 pb-2">
            <a
              href="#kontakt"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center text-sm"
            >
              Konsultacja techniczna
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
