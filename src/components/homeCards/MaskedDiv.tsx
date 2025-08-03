"use client"
import React from "react"
import MaskedDiv from "../ui/masked-div"

function MaskedDivDemo() {
  return (
    <>
    <div className="container">
      <div className="masked-video-container">
        <MaskedDiv maskType="type-3" className="masked-video">
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
        </MaskedDiv>

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

        .video-element {
          transition: all 0.3s;
          cursor: pointer;
        }

        .video-element:hover {
          transform: scale(1.05);
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
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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


