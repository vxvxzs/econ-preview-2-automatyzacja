'use client'

import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

const HouseVisualizer3D = lazy(() => import('@/components/questionnaire/HouseVisualizer3D'))
import { 
  Zap, 
  Home, 
  Building2, 
  Warehouse, 
  Sun, 
  BatteryFull, 
  Flame, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  User,
  ArrowRight
} from 'lucide-react'
import { submitQuestionnaire } from '../actions/submitQuestionnaire'

type FormData = {
  serviceType: string
  buildingType: string
  monthlyBill: number
  roofType: string
  roofArea: number
  name: string
  phone: string
  email: string
  location: string
}

const steps = [
  'Typ usługi',
  'Rodzaj budynku',
  'Rachunki',
  'Dach',
  'Kontakt'
]

export default function QuestionnairePage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    buildingType: '',
    monthlyBill: 400,
    roofType: 'pitched',
    roofArea: 80,
    name: '',
    phone: '',
    email: '',
    location: ''
  })

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const updateData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const result = await submitQuestionnaire(formData)
    if (result.success) {
      setIsSuccess(true)
    }
    setIsSubmitting(false)
  }

  // Animation variants
  const slideVariants: Variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    })
  }

  const [direction, setDirection] = useState(1)

  const handleNext = () => {
    setDirection(1)
    nextStep()
  }

  const handlePrev = () => {
    setDirection(-1)
    prevStep()
  }

  if (isSuccess) {
    return <SuccessStep />
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.3] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-[120px]" />
      </div>

      <div className={`w-full ${step === 4 ? 'max-w-5xl' : 'max-w-2xl'} relative z-10 transition-all duration-500`}>
        {/* Header */}
        <div className="mb-12 text-center">
          <a href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center transition-transform group-hover:scale-110">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="font-black text-sm tracking-tight text-zinc-950 uppercase">
              Econ <span className="font-normal text-zinc-500">Inżynieria</span>
            </span>
          </a>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">Kreator wyceny systemu</h1>
          <p className="text-sm text-zinc-500 mt-2">Odpowiedz na kilka pytań, aby otrzymać darmową analizę techniczną.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
              Krok {step} z {steps.length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {steps[step - 1]}
            </span>
          </div>
          <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${(step / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'circOut' }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {step === 1 && <Step1 data={formData} update={updateData} onNext={handleNext} />}
              {step === 2 && <Step2 data={formData} update={updateData} onNext={handleNext} />}
              {step === 3 && <Step3 data={formData} update={updateData} onNext={handleNext} />}
              {step === 4 && <Step4 data={formData} update={updateData} onNext={handleNext} />}
              {step === 5 && (
                <Step5 
                  data={formData} 
                  update={updateData} 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {step > 1 && !isSubmitting && (
          <div className="mt-8 flex justify-start">
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors"
            >
              <ChevronLeft size={14} />
              Wstecz
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

// --- Steps Components ---

function Step1({ data, update, onNext }: any) {
  const options = [
    { id: 'pv', label: 'Fotowoltaika', icon: Sun, desc: 'Sama instalacja PV' },
    { id: 'hp', label: 'Pompa Ciepła', icon: Flame, desc: 'Ogrzewanie ekologiczne' },
    { id: 'full', label: 'Hybryda (PV + HP)', icon: Zap, desc: 'Pełna niezależność', featured: true },
    { id: 'storage', label: 'Magazyn Energii', icon: BatteryFull, desc: 'Rozbudowa systemu' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => {
            update({ serviceType: opt.id })
            onNext()
          }}
          className={`flex flex-col p-6 rounded-sm border text-left transition-all group ${
            data.serviceType === opt.id
              ? 'border-blue-600 bg-blue-50/30'
              : 'border-zinc-200 hover:border-zinc-400 bg-white'
          } ${opt.featured ? 'sm:col-span-1 ring-1 ring-blue-100' : ''}`}
        >
          <div className={`mb-4 w-10 h-10 rounded-sm flex items-center justify-center transition-colors ${
            data.serviceType === opt.id ? 'bg-blue-600 text-white' : 'bg-zinc-50 text-zinc-500 group-hover:bg-zinc-100'
          }`}>
            <opt.icon size={20} />
          </div>
          <div className="font-bold text-zinc-950 mb-1">{opt.label}</div>
          <div className="text-xs text-zinc-500">{opt.desc}</div>
        </button>
      ))}
    </div>
  )
}

function Step2({ data, update, onNext }: any) {
  const options = [
    { id: 'residential', label: 'Dom jednorodzinny', icon: Home, desc: 'Instalacja prywatna' },
    { id: 'commercial', label: 'Firma / Obiekt biurowy', icon: Building2, desc: 'Optymalizacja kosztów' },
    { id: 'farm', label: 'Gospodarstwo rolne', icon: Warehouse, desc: 'Duże zapotrzebowanie' },
  ]

  return (
    <div className="space-y-4">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => {
            update({ buildingType: opt.id })
            onNext()
          }}
          className={`w-full flex items-center gap-6 p-6 rounded-sm border text-left transition-all group ${
            data.buildingType === opt.id
              ? 'border-blue-600 bg-blue-50/30'
              : 'border-zinc-200 hover:border-zinc-400 bg-white'
          }`}
        >
          <div className={`w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${
            data.buildingType === opt.id ? 'bg-blue-600 text-white' : 'bg-zinc-50 text-zinc-500'
          }`}>
            <opt.icon size={24} />
          </div>
          <div>
            <div className="font-bold text-zinc-950">{opt.label}</div>
            <div className="text-xs text-zinc-500 mt-1">{opt.desc}</div>
          </div>
          <ChevronRight className="ml-auto text-zinc-300" size={20} />
        </button>
      ))}
    </div>
  )
}

function Step3({ data, update, onNext }: any) {
  const savingsPerMonth = Math.round(data.monthlyBill * 0.85)
  const savings15Years = savingsPerMonth * 12 * 15

  return (
    <div className="space-y-12">
      <div className="text-center">
        <div className="text-4xl font-black text-zinc-950 mb-4">{data.monthlyBill} zł</div>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={data.monthlyBill}
          onChange={(e) => update({ monthlyBill: parseInt(e.target.value) })}
          className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
        />
        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <span>100 zł</span>
          <span>Średni miesięczny rachunek</span>
          <span>2000+ zł</span>
        </div>
      </div>

      <div className="p-8 rounded-sm bg-blue-600 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <Zap className="absolute top-[-20px] right-[-20px] w-32 h-32 text-white/10 rotate-12" />
        <div className="relative z-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100 mb-2">
            Przewidywane oszczędności (15 lat)
          </div>
          <div className="text-3xl font-black mb-2">
            ~{savings15Years.toLocaleString()} zł
          </div>
          <div className="text-xs text-blue-100/80 leading-relaxed">
            Obliczenia oparte na średnim wzroście cen energii o 4% rocznie i sprawności paneli na poziomie 92% po 15 latach.
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-5 bg-zinc-950 text-white rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-lg"
      >
        Kontynuuj
      </button>
    </div>
  )
}

function Step4({ data, update, onNext }: any) {
  const options = [
    { id: 'pitched', label: 'Skośny', desc: 'Blachodachówka, dachówka' },
    { id: 'flat', label: 'Płaski', desc: 'Papa, membrana, beton' },
    { id: 'ground', label: 'Grunt', desc: 'Wolnostojąca konstrukcja' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Konstrukcja dachu</label>
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => update({ roofType: opt.id })}
                className={`w-full p-4 rounded-sm border text-left transition-all ${
                  data.roofType === opt.id
                    ? 'border-blue-600 bg-blue-50/30'
                    : 'border-zinc-200 hover:border-zinc-400 bg-white'
                }`}
              >
                <div className="font-bold text-zinc-950 text-sm">{opt.label}</div>
                <div className="text-[10px] text-zinc-500 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Powierzchnia montażowa</label>
            <span className="text-xl font-black text-zinc-950">{data.roofArea} m²</span>
          </div>
          <input
            type="range"
            min="20"
            max="300"
            step="5"
            value={data.roofArea}
            onChange={(e) => update({ roofArea: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 bg-zinc-950 text-white rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-lg"
        >
          Dalej
        </button>
      </div>

      <div className="hidden lg:block sticky top-0">
        <Suspense fallback={<div className="w-full h-[400px] bg-zinc-50 animate-pulse rounded-sm" />}>
          <HouseVisualizer3D roofType={data.roofType} area={data.roofArea} />
        </Suspense>
      </div>
      
      {/* Mobile preview */}
      <div className="lg:hidden mt-4">
         <Suspense fallback={<div className="w-full h-[250px] bg-zinc-50 animate-pulse rounded-sm" />}>
           <div className="h-[250px]">
             <HouseVisualizer3D roofType={data.roofType} area={data.roofArea} />
           </div>
         </Suspense>
      </div>
    </div>
  )
}

function Step5({ data, update, onSubmit, isSubmitting }: any) {
  const inputCls = "w-full bg-zinc-50 border border-zinc-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
            <User size={10} /> Imię i nazwisko
          </label>
          <input 
            type="text" 
            placeholder="Jan Kowalski" 
            className={inputCls} 
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
            <Phone size={10} /> Telefon
          </label>
          <input 
            type="tel" 
            placeholder="+48 000 000 000" 
            className={inputCls} 
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
          <Mail size={10} /> Adres e-mail
        </label>
        <input 
          type="email" 
          placeholder="jan@przyklad.pl" 
          className={inputCls} 
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
          <MapPin size={10} /> Lokalizacja inwestycji
        </label>
        <input 
          type="text" 
          placeholder="np. Kielce, gmina Morawica" 
          className={inputCls} 
          value={data.location}
          onChange={(e) => update({ location: e.target.value })}
        />
      </div>

      <p className="text-[10px] text-zinc-400 leading-relaxed text-center italic">
        Klikając "Zamów analizę", wyrażasz zgodę na przetwarzanie danych osobowych w celu przygotowania oferty technicznej przez Econ Fotowoltaika.
      </p>

      <button
        onClick={onSubmit}
        disabled={isSubmitting || !data.name || !data.phone}
        className="w-full py-5 bg-blue-600 text-white rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Przetwarzanie...
          </>
        ) : (
          <>
            Zamów darmową analizę
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </div>
  )
}

function SuccessStep() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md"
      >
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-zinc-950 mb-4 tracking-tighter">Świetna wiadomość!</h2>
        <p className="text-zinc-600 mb-10 leading-relaxed">
          Otrzymaliśmy Twoje dane. <br />
          <span className="font-bold text-zinc-950">Robert z Econu</span> przygotowuje już dla Ciebie profesjonalną analizę techniczną. 
          Skontaktujemy się w ciągu 24h.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
        >
          Powrót do strony głównej
          <ChevronRight size={14} />
        </a>
      </motion.div>
    </main>
  )
}
