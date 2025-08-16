
"use client";

import AiInputCard from '@/components/homeCards/AiInputCard'
import CardCarouselParent from '@/components/homeCards/CardCarouselParent'
import { SpecialCard } from '@/components/homeCards/SpecialCard'
import TemplateCard from '@/components/homeCards/TemplateCard'
import { TextScrollDemo } from '@/components/homeCards/TextScroll'
import { MouseTrailDemo } from '@/components/homeCards/FlipLink'
import MaskedDivDemo from '@/components/homeCards/MaskedDiv'
import HeroContent from '@/components/landingPage/HeroContent'
import Navbar from '@/components/navbar/Navbar'
import { Footer } from '@/components/footer/footer'
import React from 'react'
import { useHomepage } from '@/components/ui/homepage-context'

const Page = () => {
  const { content } = useHomepage();
  
  return (
    <div className="overflow-x-hidden min-h-screen bg-white dark:bg-black w-full">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
       
        <HeroContent />
        <MaskedDivDemo />
        <CardCarouselParent />
        <TemplateCard />
        <SpecialCard />
                 <AiInputCard  />
         
         {/* FlipLink and Contact Form Section */}
         <MouseTrailDemo />
         
         {/* Footer */}
         <Footer />
         
         {/* SEO Content Section - Hidden but working for SEO */}
         <section className="py-0 mt-16 text-center bg-gray-50 sr-only dark:bg-gray-900">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
              {content?.seo?.title || "Nishant Mogahaa (NMM) - Expert Full Stack Developer & AI Engineer"}
            </h1>
            <p className="mb-6 text-xl text-gray-600 dark:text-gray-300">
              {content?.seo?.description || "Also known as Nishant Mogha or NMM. Leading Full Stack Developer specializing in React, Next.js, Node.js, and AI/ML technologies. Best developer for hire in India with expertise in modern web development and artificial intelligence."}
            </p>
            <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
              <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Full Stack Development
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Expert in React, Next.js, Node.js, Python, and modern web technologies. 
                  Building scalable and high-performance web applications.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  AI & Machine Learning
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Specialized in AI/ML development, creating intelligent solutions 
                  and implementing cutting-edge artificial intelligence technologies.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  IT Consulting
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Professional IT consultant providing strategic technology solutions 
                  and digital transformation services through Cybershoora IT Solutions.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                Why Choose Nishant Mogahaa?
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="text-left">
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>✅ Expert Full Stack Developer</li>
                    <li>✅ AI/ML Specialist</li>
                    <li>✅ React & Next.js Expert</li>
                    <li>✅ Node.js Backend Developer</li>
                    <li>✅ Mobile App Developer</li>
                  </ul>
                </div>
                <div className="text-left">
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>✅ UI/UX Designer</li>
                    <li>✅ Database Developer</li>
                    <li>✅ API Development</li>
                    <li>✅ Cloud Solutions</li>
                    <li>✅ IT Consultant</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                Services Offered
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">Web Development</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200">React, Next.js, Node.js, Full Stack</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                  <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">AI/ML Development</h3>
                  <p className="text-sm text-green-700 dark:text-green-200">Machine Learning, AI Solutions</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                  <h3 className="mb-2 font-semibold text-purple-900 dark:text-purple-100">IT Consulting</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-200">Cybershoora IT Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    
  )
}

export default Page