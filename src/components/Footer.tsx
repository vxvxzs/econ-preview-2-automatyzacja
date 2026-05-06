import { Leaf } from 'lucide-react'

interface Props { onOpenQuiz: () => void }

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

export default function Footer({ onOpenQuiz }: Props) {
  return (
    <footer id="footer" className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" id="footer-logo" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf size={15} className="text-white fill-white" />
              </div>
              <span className="font-black text-sm tracking-tight text-white">
                ECON <span className="text-slate-400 font-normal">FOTOWOLTAIKA</span>
              </span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Inżynieria Odnawialnych Źródeł Energii.
              <br />
              Instalacje PV · Pompy Ciepła · Magazyny Energii
              <br />
              Kielce i region świętokrzyski.
            </p>
            <div className="mt-6 space-y-1.5">
              <a href="mailto:econpoland@gmail.com" className="block text-xs text-slate-400 hover:text-emerald-400 transition-colors">
                econpoland@gmail.com
              </a>
              <div className="text-xs text-slate-500">ul. Piekoszowska 363, 25-645 Kielce</div>
            </div>
            <div className="mt-6">
              <button onClick={onOpenQuiz} className="inline-flex items-center gap-2 text-xs font-bold bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20">
                Bezpłatna wycena →
              </button>
            </div>

            {/* Eco badge */}
            <div className="mt-6 inline-flex items-center gap-2 bg-emerald-900/50 border border-emerald-800 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-medium">100% Energia odnawialna</span>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.heading}>
              <h5 className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-500 mb-4">
                {section.heading}
              </h5>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
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
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Econ Fotowoltaika / Econ Poland.
            Wszelkie prawa zastrzeżone.
          </p>
          <p className="text-[11px] text-slate-600">
            NIP: — · REGON: — · KRS: —
          </p>
        </div>
      </div>
    </footer>
  )
}
