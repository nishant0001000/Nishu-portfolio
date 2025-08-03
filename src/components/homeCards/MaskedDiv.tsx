"use client"
import React, { useState, useEffect } from "react"
import MaskedDiv from "../ui/masked-div"

function MaskedDivDemo() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Check screen size on mount and resize
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 640)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const getDayName = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
  }

  const getMonthName = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months[date.getMonth()]
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <>
    <div className="container">
      <div className="masked-video-container">
        <MaskedDiv maskType="type-3" className="masked-video">
          <div className="video-wrapper">
            <video
              className="video-element"
              autoPlay
              loop
              muted
            >
              <source
                src="https://videos.pexels.com/video-files/18069166/18069166-uhd_2560_1440_24fps.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </MaskedDiv>

        {/* Date Time Rectangle positioned outside masked div at top center */}
        {isDesktop && (
          <div className="datetime-container">
            <div className="datetime-rectangle">
              <div className="day-display">{getDayName(currentTime)}</div>
              <div className="time-display">{formatTime(currentTime)}</div>
              <div className="date-display">{getMonthName(currentTime)} {currentTime.getDate()}, {currentTime.getFullYear()}</div>
            </div>
          </div>
        )}

        {/* Orange Circle Button positioned at bottom-left of masked video */}
        <div className="button-container">
          <div className="button-wrapper">
            <div className="orange-button">
              <svg
                className="arrow-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          justify-content: space-between;
          margin: 0 auto;
          margin-top: 0;
          max-width: 80rem;
          margin-bottom: 8.75rem;
          align-items: space-between;
        }

        .masked-video-container {
          display: flex;
          position: relative;
          flex-direction: column;
          align-items: center;
        }

        .masked-video {
          margin: 1rem 0;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .video-element {
          transition: all 0.3s;
          cursor: pointer;
        }

        .video-element:hover {
          transform: scale(1.05);
        }

        .datetime-container {
          position: absolute;
          left: 51.5%;
          transform: translateX(-50%);
          z-index: 20;
          margin-bottom: 5rem;
          border-radius: 15rem;
        }

        .datetime-rectangle {
          background: #f97316;
          border-radius: 8px;
          padding: 0.1rem;
          color: white;
          text-align: center;
          width: 4rem;
          height: 1.3rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }

        .time-display {
          font-size: 0.4rem;
          font-weight: 400;
          color: white;
          margin-top: -0.1rem;
        }

        .day-display {
          font-size: 0.29rem;
          font-weight: 800;
          color: white;
         
        }

        .date-display {
          font-size: 0.25rem;
          color: white;
          margin-top: -0.1rem;
        }

        .button-container {
          position: absolute;
          bottom: 0.95rem;
          left: 0.1rem;
        }

        .button-wrapper {
          position: relative;
        }

        .orange-button {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 2.3rem;
          height: 2.3rem;
          background-color: #f97316;
          border-radius: 50%;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
          
          cursor: pointer;
        }

        .orange-button:hover {
          transform: scale(1.1);
        }

        .arrow-icon {
          width: 0.75rem;
          height: 0.75rem;
          color: white;
          transition: transform 0.7s;
          transform: rotate(-120deg);
        }

        .orange-button:hover .arrow-icon {
          transform: rotate(0deg);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Desktop Styles */
        @media (min-width: 640px) {
          .datetime-rectangle {
            width: 13rem !important;
            height: 5rem !important;
            padding: 0.1rem !important;
            border-radius: 15rem !important;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6) !important;
          }

          .time-display {
            font-size: 1.5rem !important;
            margin-top: -0.5rem !important;
          }

          .day-display {
            font-size: 1.125rem !important;
          }

          .date-display {
            font-size: 0.875rem !important;
            margin-top: -0.4rem !important;
          }

          .button-container {
            left: 0rem !important;
            bottom: 3rem !important;
            right: auto !important;
          }

          .orange-button {
            width: 8rem !important;
            height: 8rem !important;
          }

          .arrow-icon {
            width: 2.5rem !important;
            height: 2.5rem !important;
          }
        }
      `}</style>
    </div>
    </>
  )
}

export default MaskedDivDemo


