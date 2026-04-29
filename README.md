# Econ Fotowoltaika — Next.js Landing Page

## Stack
- **Next.js 14** (App Router)
- **Tailwind CSS 3**
- **Framer Motion 11** (scroll-reveal, page entry animations)
- **Lucide React** (minimalist icons)
- **TypeScript**

## Uruchomienie lokalne

```bash
# 1. Przejdź do folderu projektu
cd next-app

# 2. Zainstaluj zależności (wymagany Node.js ≥18)
npm install

# 3. Uruchom serwer deweloperski
npm run dev
```

Strona dostępna pod: **http://localhost:3000**

## Budowanie do produkcji

```bash
npm run build
npm start
```

## Struktura projektu

```
next-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout, Inter font, SEO meta
│   │   ├── page.tsx         # Główna strona (all sections)
│   │   └── globals.css      # Tailwind + design system
│   └── components/
│       ├── Navbar.tsx        # Sticky navbar + mobile menu
│       ├── Hero.tsx          # Hero section
│       ├── Services.tsx      # Bento grid usług
│       ├── Solutions.tsx     # Karty rozwiązań (zamiast pakietów)
│       ├── Process.tsx       # 4-etapowy proces
│       ├── LocalAuthority.tsx # O firmie + adres
│       ├── Contact.tsx       # Formularz kontaktowy
│       └── Footer.tsx        # Stopka
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── tsconfig.json
```

## Wymagania systemowe

- Node.js **≥ 18.17**
- npm **≥ 9**

Instalacja Node.js: https://nodejs.org/en/download
