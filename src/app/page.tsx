'use client'

import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Solutions from '@/components/Solutions'
import SavingsCalculator from '@/components/SavingsCalculator'
import Process from '@/components/Process'
import LocalAuthority from '@/components/LocalAuthority'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import QuizModal from '@/components/QuizModal'

export default function Home() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [prefillBill, setPrefillBill] = useState<number | undefined>()

  const openQuiz = useCallback(() => {
    setPrefillBill(undefined)
    setQuizOpen(true)
  }, [])

  const openQuizWithBill = useCallback((bill: number) => {
    setPrefillBill(bill)
    setQuizOpen(true)
  }, [])

  const closeQuiz = useCallback(() => {
    setQuizOpen(false)
  }, [])

  return (
    <main>
      <Navbar onOpenQuiz={openQuiz} />
      <Hero onOpenQuiz={openQuiz} />
      <Services />
      <Solutions onOpenQuiz={openQuiz} />
      <SavingsCalculator onOpenQuiz={openQuizWithBill} />
      <Process />
      <LocalAuthority />
      <Contact />
      <Footer onOpenQuiz={openQuiz} />
      <QuizModal isOpen={quizOpen} onClose={closeQuiz} prefillBill={prefillBill} />
    </main>
  )
}
