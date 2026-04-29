import { Zap } from 'lucide-react'

const footerSections = [
  {
    heading: 'Usługi',
    links: [
      { label: 'Instalacje Fotowoltaiczne', href: '#uslugi' },
      { label: 'Pompy Ciepła',              href: '#uslugi' },
      { label: 'Magazyny Energii',          href: '#uslugi' },
      { label: 'Serwis i Monitoring',       href: '#uslugi' },
    ],
  },
  {
    heading: 'Systemy',
    links: [
      { label: 'System Fotowoltaiczny',          href: '#systemy' },
      { label: 'Integracja PV + Pompa Ciepła',   href: '#systemy' },
      { label: 'Autonomia: PV + Pompa + Magazyn', href: '#systemy' },
    ],
  },
  {
    heading: 'Firma',
    links: [
      { label: 'O firmie', href: '#firma' },
      { label: 'Proces',   href: '#proces' },
      { label: 'Kontakt',  href: '#kontakt' },
    ],
  },
]

export default function Footer() {
  return (
    <footer id="footer" className="bg-black border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" id="footer-logo" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center">
                <Zap size={14} className="text-white fill-white" />
              </div>
              <span className="font-black text-sm tracking-tight text-white">
                ECON <span className="text-zinc-600 font-normal">FOTOWOLTAIKA</span>
              </span>
            </a>
            <p className="text-xs text-zinc-700 leading-relaxed max-w-xs">
              Inżynieria Odnawialnych Źródeł Energii.
              <br />
              Instalacje PV · Pompy Ciepła · Magazyny Energii
              <br />
              Kielce i region świętokrzyski.
            </p>
            <div className="mt-6">
              <a
                href="mailto:econpoland@gmail.com"
                className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                econpoland@gmail.com
              </a>
              <div className="mt-1 text-xs text-zinc-800">
                ul. Piekoszowska 363, 25-645 Kielce
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.heading}>
              <h5 className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-700 mb-4">
                {section.heading}
              </h5>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-zinc-600 hover:text-zinc-200 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-800">
            © {new Date().getFullYear()} Econ Fotowoltaika / Econ Poland.
            Wszelkie prawa zastrzeżone.
          </p>
          <p className="text-[11px] text-zinc-900">
            NIP: — · REGON: — · KRS: —
          </p>
        </div>
      </div>
    </footer>
  )
}
