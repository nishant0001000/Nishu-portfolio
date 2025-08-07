"use client"

import { useEffect } from 'react'

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Check if visitor has already been tracked in this session
        const hasTracked = sessionStorage.getItem('visitorTracked')
        if (hasTracked) return

        // Get visitor info
        const visitorInfo = {
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenResolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timestamp: new Date().toISOString()
        }

        // Track visitor
        const response = await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'visitor',
            visitorInfo
          })
        })

        if (response.ok) {
          // Mark as tracked for this session
          sessionStorage.setItem('visitorTracked', 'true')
          console.log('✅ Visitor tracked successfully')
        }
      } catch (error) {
        console.error('❌ Error tracking visitor:', error)
      }
    }

    trackVisitor()
  }, [])

  return null // This component doesn't render anything
}

export default VisitorTracker
