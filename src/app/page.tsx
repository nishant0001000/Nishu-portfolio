
import AiInputCard from '@/components/homeCards/AiInputCard'
import CardCarouselParent from '@/components/homeCards/CardCarouselParent'
import { SpecialCard } from '@/components/homeCards/SpecialCard'
import TemplateCard from '@/components/homeCards/TemplateCard'
import { TextScrollDemo } from '@/components/homeCards/TextScroll'
import HeroContent from '@/components/landingPage/HeroContent'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'

const page = () => {
  return (
    <div className="overflow-x-hidden min-h-screen bg-white dark:bg-black">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Navbar />
        <HeroContent />
        <CardCarouselParent />
        <TemplateCard />
        <SpecialCard />
        <AiInputCard />
        <TextScrollDemo/>
      </div>
    </div>
  )
}

export default page