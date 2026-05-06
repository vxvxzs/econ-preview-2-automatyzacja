import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Econ Fotowoltaika | Inżynieria Odnawialnych Źródeł Energii – Kielce',
  description:
    'Profesjonalne instalacje fotowoltaiczne, pompy ciepła i magazyny energii dla domów i przemysłu w Kielcach i regionie świętokrzyskim. Econ Fotowoltaika – rzetelna inżynieria OZE.',
  keywords:
    'fotowoltaika Kielce, pompa ciepła Kielce, magazyn energii, instalacje PV świętokrzyskie, Econ Poland',
  openGraph: {
    title: 'Econ Fotowoltaika | Inżynieria OZE – Kielce',
    description:
      'Profesjonalne systemy fotowoltaiczne i grzewcze. Kielce i region świętokrzyski.',
    locale: 'pl_PL',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={inter.variable}>
      <body className="bg-white text-zinc-950 antialiased relative min-h-screen">
        {/* Global Background Decoration — dot pattern only (cheap CSS bg, no blur repaint) */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.28] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] bg-[radial-gradient(#d1fae5_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        {children}
      </body>
    </html>
  )
}
