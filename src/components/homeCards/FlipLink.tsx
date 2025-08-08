 "use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { SparklesIcon, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"

import { Badge } from "@/components/ui/badge"
import { SlideButton } from "./SlideButton"
import { CustomSlideButton } from "../ui/custom-slide-button"

import { cn } from "@/lib/utils"

import { FlipLink } from "../ui/text-effect-flipper"

// Helper function to detect browser name
const getBrowserName = (): string => {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
  if (userAgent.includes('Edg')) return 'Edge'
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera'
  return 'Unknown'
}

const Icons = {
  linkedin: () => (
    <div className="w-[25px] h-[25px] md:w-[60px] md:h-[60px] rounded-[4px] md:rounded-[10px] bg-[#D9D9D9] transition-all duration-500 ease-in-out group-hover:bg-accent flex items-center justify-center">
      <Image
        src="/images/linkedin.svg"
        alt="LinkedIn"
        width={50}
        height={50}
        className="w-[12px] h-[12px] md:w-[35px] md:h-[35px] transition-all duration-500 ease-in-out group-hover:brightness-0 group-hover:invert"
      />
    </div>
  ),
  github: () => (
    <div className="w-[25px] h-[25px] md:w-[60px] md:h-[60px] rounded-[4px] md:rounded-[10px] bg-[#D9D9D9] transition-all duration-500 ease-in-out group-hover:bg-accent flex items-center justify-center">
      <Image
        src="/images/github.svg"
        alt="GitHub"
        width={50}
        height={50}
        className="w-[12px] h-[12px] md:w-[35px] md:h-[35px] transition-all duration-500 ease-in-out group-hover:brightness-0 group-hover:invert"
      />
    </div>
  ),
  instagram: () => (
    <div className="w-[25px] h-[25px] md:w-[60px] md:h-[60px] rounded-[4px] md:rounded-[10px] bg-[#D9D9D9] transition-all duration-500 ease-in-out group-hover:bg-accent flex items-center justify-center">
      <Image
        src="/images/instagram.svg"
        alt="Instagram"
        width={50}
        height={50}
        className="w-[12px] h-[12px] md:w-[35px] md:h-[35px] transition-all duration-500 ease-in-out group-hover:brightness-0 group-hover:invert"
      />
    </div>
  ),
}

export function MouseTrailDemo() {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [selectedTime, setSelectedTime] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customDateTime, setCustomDateTime] = useState("")
  const [showAmPmDropdown, setShowAmPmDropdown] = useState(false)
  const [selectedAmPm, setSelectedAmPm] = useState("")
  const [customSelectedTime, setCustomSelectedTime] = useState("")
  const [customSelectedAmPm, setCustomSelectedAmPm] = useState("")
  const [showCustomTimeDropdown, setShowCustomTimeDropdown] = useState(false)
  const [showCustomAmPmDropdown, setShowCustomAmPmDropdown] = useState(false)
  const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91")
  const [countrySearchTerm, setCountrySearchTerm] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const countryCodeDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTimeDropdown(false)
      }
      if (countryCodeDropdownRef.current && !countryCodeDropdownRef.current.contains(event.target as Node)) {
        setShowCountryCodeDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle form submission
  const handleFormSubmit = async () => {
    // Validate form first
    if (!handleFormValidation()) {
      throw new Error("Form validation failed")
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setSubmitMessage("")

    try {
      // Collect detailed visitor information for form submissions
      const visitorInfo = {
        url: window.location.href,
        referrer: document.referrer,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        location: 'Unknown', // Default value
        device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        browser: getBrowserName(),
        timestamp: new Date().toISOString()
      }

      // Submit form immediately without waiting for location (for fast slider response)
      const response = await axios.post('/api/send-contact-email', {
        name: formData.name,
        email: formData.email,
        phone: selectedCountryCode + formData.phone,
        message: formData.message,
        preferredTime: selectedTime,
        visitorInfo // Include visitor info (location will be 'Unknown' if not available quickly)
      })

      if (response.data.success) {
        // Form submission is now handled by /api/send-contact-email
        // No need for separate tracking call as it's already stored in database
        console.log('✅ Form submitted and stored in database successfully')

        setSubmitStatus("success")
        setSubmitMessage("Thank you! Your message has been sent successfully. You'll receive a confirmation email shortly, and Nishant will get back to you soon!")
        
        // Try to get location in background after successful submission (non-blocking)
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
              console.log('📍 Location obtained after submission:', location)
              // Could optionally update the form record with location if needed
            },
            (geoError) => {
              console.log('📍 Location not available after submission:', geoError.message)
            },
            { 
              timeout: 10000,
              enableHighAccuracy: false,
              maximumAge: 300000
            }
          )
        }
        
        // Show success animation after a short delay
        setTimeout(() => {
          setShowSuccessAnimation(true)
        }, 1000)
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        })
        setSelectedTime("")
        setSelectedCountryCode("+91")
      } else {
        setSubmitStatus("error")
        setSubmitMessage("Failed to send message. Please try again later.")
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error('❌ Error sending contact form:', error)
      setSubmitStatus("error")
      setSubmitMessage("Failed to send message. Please try again later.")
      throw error // Re-throw to let slider button handle the error state
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form validation before allowing slide
  const handleFormValidation = () => {
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error")
      setSubmitMessage("Please fill in all required fields (Name, Email, Message)")
      return false
    }

    const emailRegex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus("error")
      setSubmitMessage("Please enter a valid email address")
      return false
    }

    return true
  }

  return (
    <div className="grid grid-cols-1 gap-8 px-4 pb-4 mx-auto my-20 max-w-7xl md:grid-cols-2">
      {/* Left Column - Original FlipLink Style */}
      <section className="h-4xl mx-auto w-full rounded-[24px] border border-black/5 p-2 shadow-sm dark:border-white/5 md:rounded-t-[44px]">
        <div className="relative mx-auto w-full rounded-[24px] border border-black/5 bg-neutral-800/5 shadow-sm dark:border-white/5 md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px]">
          <article className="flex z-50 flex-col justify-center items-center mt-20">
            <Badge
              variant="outline"
              className="mb-3 rounded-[14px] border border-black/10 bg-white text-base dark:border-white/5 dark:bg-neutral-800/5 md:left-6"
            >
              <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
              Hover Over Links
            </Badge>
          </article>
          
          <section className="h-full">
            <section className="grid gap-4 place-content-center px-8 py-24 text-black">
              <div className="flex gap-4 justify-center items-center group">
                <Icons.linkedin />
                <FlipLink href="https://www.linkedin.com/in/nishant-mogahaa-11b16818a/">Linkedin</FlipLink>
              </div>
              
              <div className="flex gap-4 justify-center items-center group">
                <FlipLink href="https://github.com/nishant0001000/">Github</FlipLink>
                <Icons.github />
              </div>
              <div className="flex gap-4 justify-center items-center group">
                <Icons.instagram />
                <FlipLink href="https://instagram.com/nishant_mogahaa/">Instagram</FlipLink>
              </div>
            </section>
          </section>
        </div>
      </section>

      {/* Right Column - Contact Form */}
      <section className="h-4xl mx-auto w-full rounded-[24px] border border-black/5 p-2 shadow-sm dark:border-white/5 md:rounded-t-[44px]">
        <div className="relative mx-auto w-full rounded-[24px] border border-black/5 bg-white/80 dark:bg-neutral-800/5 backdrop-blur-sm shadow-sm dark:border-white/5 md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] p-8">
          <h3 className="p-8 mb-6 text-2xl font-semibold text-center text-black border-b dark:text-white border-black/10 dark:border-white/10">
            Get In Touch
          </h3>

          {/* Success Animation */}
          <AnimatePresence>
            {showSuccessAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="flex flex-col justify-center items-center py-16 text-center"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
                  className="mb-8"
                >
                  <div className="flex justify-center items-center w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
                    Thank You!
                  </h2>
                  <p className="max-w-md text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Your response will be sent to <span className="font-semibold text-[#EEBDE0]">Nishant</span>.
                  </p>
                  <p className="max-w-md text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-[#EEBDE0]">Nishant will reach you soon!</span>
                  </p>
                </motion.div>

                {/* Animated Elements */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="flex mt-8 space-x-4"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-3 h-3 bg-[#EEBDE0] rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="w-3 h-3 bg-[#D4A5C7] rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="w-3 h-3 bg-[#EEBDE0] rounded-full"
                  />
                </motion.div>

                {/* Send Again Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessAnimation(false);
                    setSubmitStatus("idle");
                    setSubmitMessage("");
                  }}
                  className="mt-10 px-6 py-2 rounded-[10px] bg-gradient-to-r from-[#EEBDE0] to-[#D4A5C7] text-black font-semibold shadow hover:from-[#D4A5C7] hover:to-[#EEBDE0] transition-all duration-300"
                >
                  Send Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Form */}
          <AnimatePresence>
            {!showSuccessAnimation && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form 
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mobile Number
                    </label>
                    <div className="flex gap-2 w-full">
                      <div className="relative" ref={countryCodeDropdownRef}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowCountryCodeDropdown(!showCountryCodeDropdown)
                            if (!showCountryCodeDropdown) {
                              setCountrySearchTerm("")
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300 flex items-center justify-between min-w-[100px] md:min-w-[120px]"
                        >
                          <span className="text-black dark:text-white">
                            {selectedCountryCode}
                          </span>
                          <motion.div
                            animate={{
                              rotate: showCountryCodeDropdown ? 180 : 0,
                              scale: showCountryCodeDropdown ? 1.1 : 1,
                            }}
                            whileHover={{
                              rotate: showCountryCodeDropdown ? 180 : 15,
                              scale: 1.1,
                              transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 10,
                              },
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 25,
                            }}
                          >
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {showCountryCodeDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="overflow-hidden absolute right-0 left-0 top-full z-10 mt-1 max-h-64 bg-white rounded-lg border shadow-lg dark:bg-black border-black/10 dark:border-white/10"
                            >
                              <div className="overflow-y-auto overflow-x-hidden max-h-64 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
                                <div className="p-1">
                                  {/* Search Input */}
                                  <div className="sticky top-0 pb-2 mb-2 bg-white border-b border-gray-200 dark:bg-black dark:border-gray-700">
                                    <input
                                      type="text"
                                      placeholder="Search country..."
                                      value={countrySearchTerm}
                                      onChange={(e) => setCountrySearchTerm(e.target.value)}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  
                                  {/* Country List */}
                                  {(() => {
                                    const countries = [
                                      { code: "+91", country: "India", flag: "🇮🇳" },
                                      { code: "+1", country: "USA", flag: "🇺🇸" },
                                      { code: "+44", country: "UK", flag: "🇬🇧" },
                                      { code: "+61", country: "Australia", flag: "🇦🇺" },
                                      { code: "+86", country: "China", flag: "🇨🇳" },
                                      { code: "+81", country: "Japan", flag: "🇯🇵" },
                                      { code: "+49", country: "Germany", flag: "🇩🇪" },
                                      { code: "+33", country: "France", flag: "🇫🇷" },
                                      { code: "+39", country: "Italy", flag: "🇮🇹" },
                                      { code: "+34", country: "Spain", flag: "🇪🇸" },
                                      { code: "+31", country: "Netherlands", flag: "🇳🇱" },
                                      { code: "+46", country: "Sweden", flag: "🇸🇪" },
                                      { code: "+47", country: "Norway", flag: "🇳🇴" },
                                      { code: "+45", country: "Denmark", flag: "🇩🇰" },
                                      { code: "+358", country: "Finland", flag: "🇫🇮" },
                                      { code: "+41", country: "Switzerland", flag: "🇨🇭" },
                                      { code: "+43", country: "Austria", flag: "🇦🇹" },
                                      { code: "+32", country: "Belgium", flag: "🇧🇪" },
                                      { code: "+351", country: "Portugal", flag: "🇵🇹" },
                                      { code: "+30", country: "Greece", flag: "🇬🇷" },
                                      { code: "+48", country: "Poland", flag: "🇵🇱" },
                                      { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
                                      { code: "+36", country: "Hungary", flag: "🇭🇺" },
                                      { code: "+421", country: "Slovakia", flag: "🇸🇰" },
                                      { code: "+385", country: "Croatia", flag: "🇭🇷" },
                                      { code: "+386", country: "Slovenia", flag: "🇸🇮" },
                                      { code: "+371", country: "Latvia", flag: "🇱🇻" },
                                      { code: "+372", country: "Estonia", flag: "🇪🇪" },
                                      { code: "+370", country: "Lithuania", flag: "🇱🇹" },
                                      { code: "+7", country: "Russia", flag: "🇷🇺" },
                                      { code: "+380", country: "Ukraine", flag: "🇺🇦" },
                                      { code: "+375", country: "Belarus", flag: "🇧🇾" },
                                      { code: "+387", country: "Bosnia", flag: "🇧🇦" },
                                      { code: "+389", country: "Macedonia", flag: "🇲🇰" },
                                      { code: "+381", country: "Serbia", flag: "🇷🇸" },
                                      { code: "+382", country: "Montenegro", flag: "🇲🇪" },
                                      { code: "+383", country: "Kosovo", flag: "🇽🇰" },
                                      { code: "+355", country: "Albania", flag: "🇦🇱" },
                                      { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
                                      { code: "+40", country: "Romania", flag: "🇷🇴" },
                                      { code: "+373", country: "Moldova", flag: "🇲🇩" },
                                      { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
                                      { code: "+995", country: "Georgia", flag: "🇬🇪" },
                                      { code: "+374", country: "Armenia", flag: "🇦🇲" },
                                      { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
                                      { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
                                      { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
                                      { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
                                      { code: "+976", country: "Mongolia", flag: "🇲🇳" },
                                      { code: "+850", country: "North Korea", flag: "🇰🇵" },
                                      { code: "+82", country: "South Korea", flag: "🇰🇷" },
                                      { code: "+84", country: "Vietnam", flag: "🇻🇳" },
                                      { code: "+66", country: "Thailand", flag: "🇹🇭" },
                                      { code: "+65", country: "Singapore", flag: "🇸🇬" },
                                      { code: "+60", country: "Malaysia", flag: "🇲🇾" },
                                      { code: "+62", country: "Indonesia", flag: "🇮🇩" },
                                      { code: "+63", country: "Philippines", flag: "🇵🇭" },
                                      { code: "+64", country: "New Zealand", flag: "🇳🇿" },
                                      { code: "+971", country: "UAE", flag: "🇦🇪" },
                                      { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
                                      { code: "+974", country: "Qatar", flag: "🇶🇦" },
                                      { code: "+973", country: "Bahrain", flag: "🇧🇭" },
                                      { code: "+965", country: "Kuwait", flag: "🇰🇼" },
                                      { code: "+968", country: "Oman", flag: "🇴🇲" },
                                      { code: "+967", country: "Yemen", flag: "🇾🇪" },
                                      { code: "+962", country: "Jordan", flag: "🇯🇴" },
                                      { code: "+961", country: "Lebanon", flag: "🇱🇧" },
                                      { code: "+963", country: "Syria", flag: "🇸🇾" },
                                      { code: "+964", country: "Iraq", flag: "🇮🇶" },
                                      { code: "+98", country: "Iran", flag: "🇮🇷" },
                                      { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
                                      { code: "+92", country: "Pakistan", flag: "🇵🇰" },
                                      { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
                                      { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
                                      { code: "+977", country: "Nepal", flag: "🇳🇵" },
                                      { code: "+975", country: "Bhutan", flag: "🇧🇹" },
                                      { code: "+95", country: "Myanmar", flag: "🇲🇲" },
                                      { code: "+856", country: "Laos", flag: "🇱🇦" },
                                      { code: "+855", country: "Cambodia", flag: "🇰🇭" }
                                    ]
                                    
                                    const filteredCountries = countries.filter(country => 
                                      country.country.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                                      country.code.includes(countrySearchTerm)
                                    )
                                    
                                    if (filteredCountries.length === 0) {
                                      return (
                                        <div className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                                          No countries found matching &quot;{countrySearchTerm}&quot;
                                        </div>
                                      )
                                    }
                                    
                                    return filteredCountries.map((country) => (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          setSelectedCountryCode(country.code)
                                          setShowCountryCodeDropdown(false)
                                        }}
                                        className={cn(
                                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                          selectedCountryCode === country.code
                                            ? "bg-[#EEBDE0]/15 text-[#EEBDE0]"
                                            : "text-black dark:text-white hover:bg-white/5 dark:hover:bg-black/5"
                                        )}
                                      >
                                        <div className="flex gap-2 items-center">
                                          <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            selectedCountryCode === country.code ? "bg-[#EEBDE0]" : "bg-gray-400"
                                          )}></div>
                                          <span className="text-lg">{country.flag}</span>
                                          <span>{country.code}</span>
                                        </div>
                                      </button>
                                    ))
                                  })()}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300"
                        placeholder="98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell me about your project..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Preferred Meeting/Call Time
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setShowTimeDropdown(!showTimeDropdown)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300 flex items-center justify-between"
                      >
                        <span className={selectedTime ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                          {selectedTime || "Select a time"}
                        </span>
                        <motion.div
                          animate={{
                            rotate: showTimeDropdown ? 180 : 0,
                            scale: showTimeDropdown ? 1.1 : 1,
                          }}
                          whileHover={{
                            rotate: showTimeDropdown ? 180 : 15,
                            scale: 1.1,
                            transition: {
                              type: "spring",
                              stiffness: 300,
                              damping: 10,
                            },
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 25,
                          }}
                        >
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {showTimeDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 left-0 bottom-full z-10 mb-1 bg-white rounded-lg border shadow-lg dark:bg-black border-black/10 dark:border-white/10"
                          >
                            <div className="p-1">
                              {[
                                { value: "morning", label: "Morning", time: "9 AM - 12 PM" },
                                { value: "afternoon", label: "Afternoon", time: "12 PM - 3 PM" },
                                { value: "evening", label: "Evening", time: "3 PM - 6 PM" },
                                { value: "night", label: "Night", time: "6 PM - 9 PM" },
                                { value: "custom", label: "Custom Time", time: "Select your own" }
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (option.value === "custom") {
                                      setShowCustomInput(true)
                                      setShowTimeDropdown(false)
                                    } else {
                                      setSelectedTime(`${option.label} (${option.time})`)
                                      setShowTimeDropdown(false)
                                    }
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                    selectedTime === `${option.label} (${option.time})`
                                      ? "bg-[#EEBDE0]/15 text-[#EEBDE0]"
                                      : "text-black dark:text-white hover:bg-white/5 dark:hover:bg-black/5"
                                  )}
                                >
                                  <div className="flex gap-2 items-center">
                                    <div className={cn(
                                      "w-2 h-2 rounded-full",
                                      selectedTime === `${option.label} (${option.time})` ? "bg-[#EEBDE0]" : "bg-gray-400"
                                    )}></div>
                                    {option.label}
                                  </div>
                                  <div className="mt-1 text-xs text-black/60 dark:text-white/60">
                                    {option.time}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Custom DateTime Input Modal */}
                  <AnimatePresence>
                    {showCustomInput && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-black/50"
                        onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            setShowCustomInput(false)
                          }
                        }}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="bg-white dark:bg-black rounded-[20px] border border-black/10 dark:border-white/10 p-6 shadow-xl max-w-md w-full"
                        >
                          <h4 className="mb-4 text-lg font-semibold text-black dark:text-white">
                            Select Custom Date & Time
                          </h4>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Date
                              </label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300"
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Time
                              </label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setShowCustomTimeDropdown(!showCustomTimeDropdown)
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300 flex items-center justify-between"
                                  >
                                    <span className={customSelectedTime ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                                      {customSelectedTime || "Select time"}
                                    </span>
                                    <motion.div
                                      animate={{
                                        rotate: showCustomTimeDropdown ? 180 : 0,
                                        scale: showCustomTimeDropdown ? 1.1 : 1,
                                      }}
                                      whileHover={{
                                        rotate: showCustomTimeDropdown ? 180 : 15,
                                        scale: 1.1,
                                        transition: {
                                          type: "spring",
                                          stiffness: 300,
                                          damping: 10,
                                        },
                                      }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 25,
                                      }}
                                    >
                                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </motion.div>
                                  </button>
                                  
                                  <AnimatePresence>
                                    {showCustomTimeDropdown && (
                                      <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 left-0 bottom-full z-10 mb-1 bg-white rounded-lg border shadow-lg dark:bg-black border-black/10 dark:border-white/10"
                                      >
                                        <div className="p-1">
                                          {[
                                            { value: "09:00", label: "9:00 AM" },
                                            { value: "10:00", label: "10:00 AM" },
                                            { value: "11:00", label: "11:00 AM" },
                                            { value: "12:00", label: "12:00 PM" },
                                            { value: "13:00", label: "1:00 PM" },
                                            { value: "14:00", label: "2:00 PM" },
                                            { value: "15:00", label: "3:00 PM" },
                                            { value: "16:00", label: "4:00 PM" },
                                            { value: "17:00", label: "5:00 PM" },
                                            { value: "18:00", label: "6:00 PM" },
                                            { value: "19:00", label: "7:00 PM" },
                                            { value: "20:00", label: "8:00 PM" }
                                          ].map((option) => (
                                            <button
                                              key={option.value}
                                              type="button"
                                              onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setCustomSelectedTime(option.label)
                                                setShowCustomTimeDropdown(false)
                                              }}
                                              className={cn(
                                                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                                customSelectedTime === option.label
                                                  ? "bg-[#EEBDE0]/15 text-[#EEBDE0]"
                                                  : "text-black dark:text-white hover:bg-white/5 dark:hover:bg-black/5"
                                              )}
                                            >
                                              <div className="flex gap-2 items-center">
                                                <div className={cn(
                                                  "w-2 h-2 rounded-full",
                                                  customSelectedTime === option.label ? "bg-[#EEBDE0]" : "bg-gray-400"
                                                )}></div>
                                                {option.label}
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setShowCustomAmPmDropdown(!showCustomAmPmDropdown)
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white/50 dark:bg-neutral-700/50 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EEBDE0] focus:border-transparent transition-all duration-300 flex items-center justify-between min-w-[80px]"
                                  >
                                    <span className={customSelectedAmPm ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                                      {customSelectedAmPm || "AM/PM"}
                                    </span>
                                    <motion.div
                                      animate={{
                                        rotate: showCustomAmPmDropdown ? 180 : 0,
                                        scale: showCustomAmPmDropdown ? 1.1 : 1,
                                      }}
                                      whileHover={{
                                        rotate: showCustomAmPmDropdown ? 180 : 15,
                                        scale: 1.1,
                                        transition: {
                                          type: "spring",
                                          stiffness: 300,
                                          damping: 10,
                                        },
                                      }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 25,
                                      }}
                                    >
                                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </motion.div>
                                  </button>
                                  
                                  <AnimatePresence>
                                    {showCustomAmPmDropdown && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 left-0 top-full z-10 mt-1 bg-white rounded-lg border shadow-lg dark:bg-black border-black/10 dark:border-white/10"
                                      >
                                        <div className="p-1">
                                          {[
                                            { value: "AM", label: "AM" },
                                            { value: "PM", label: "PM" }
                                          ].map((option) => (
                                            <button
                                              key={option.value}
                                              type="button"
                                              onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setCustomSelectedAmPm(option.label)
                                                setShowCustomAmPmDropdown(false)
                                              }}
                                              className={cn(
                                                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                                customSelectedAmPm === option.label
                                                  ? "bg-[#EEBDE0]/15 text-[#EEBDE0]"
                                                  : "text-black dark:text-white hover:bg-white/5 dark:hover:bg-black/5"
                                              )}
                                            >
                                              <div className="flex gap-2 items-center">
                                                <div className={cn(
                                                  "w-2 h-2 rounded-full",
                                                  customSelectedAmPm === option.label ? "bg-[#EEBDE0]" : "bg-gray-400"
                                                )}></div>
                                                {option.label}
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3 mt-6">
                            <button
                              type="button"
                              onClick={() => setShowCustomInput(false)}
                              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement
                                
                                if (dateInput?.value && customSelectedTime && customSelectedAmPm) {
                                  // Parse the selected time (e.g., "9:00 AM" -> 9:00)
                                  const timeMatch = customSelectedTime.match(new RegExp('(\\d+):(\\d+)'))
                                  if (timeMatch) {
                                    let hours = parseInt(timeMatch[1])
                                    const minutes = timeMatch[2]
                                    
                                    // Convert to 24-hour format
                                    if (customSelectedAmPm === 'PM' && hours !== 12) {
                                      hours += 12
                                    } else if (customSelectedAmPm === 'AM' && hours === 12) {
                                      hours = 0
                                    }
                                    
                                    const timeString = `${hours.toString().padStart(2, '0')}:${minutes}`
                                    const date = new Date(dateInput.value + 'T' + timeString)
                                    
                                    const formattedDate = date.toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })
                                    const formattedTime = date.toLocaleTimeString('en-US', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })
                                    
                                    setSelectedTime(`Custom: ${formattedDate} at ${formattedTime}`)
                                    setShowCustomInput(false)
                                  }
                                }
                              }}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#EEBDE0] to-[#D4A5C7] text-black font-medium rounded-[10px] hover:from-[#D4A5C7] hover:to-[#EEBDE0] transition-all duration-300"
                            >
                              Confirm
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status Message */}
                  {submitStatus !== "idle" && (
                    <div className={`p-4 rounded-[10px] text-center ${
                      submitStatus === "success" 
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800" 
                        : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                    }`}>
                      {submitMessage}
                    </div>
                  )}

                  <div className="flex justify-center">
                    <CustomSlideButton 
                      className="bg-gradient-to-r from-[#EEBDE0] to-[#D4A5C7] text-black" 
                      disabled={isSubmitting}
                      onSubmit={handleFormSubmit}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

export default MouseTrailDemo