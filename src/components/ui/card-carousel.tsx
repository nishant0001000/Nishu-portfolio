"use client"

import React from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { SparklesIcon, ArrowUpRight } from "lucide-react"
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules"

import { Badge } from "@/components/ui/badge"

interface CarouselProps {
  images: { src: string; alt: string; href?: string }[]
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
  title?: string
  subtitle?: string
  categories?: string[]
  selectedCategory?: string
  onChangeCategory?: (value: string) => void
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 1000,
  showPagination = true,
  showNavigation = true,
  title,
  subtitle,
  categories,
  selectedCategory,
  onChangeCategory,
}) => {
  // Ensure loop works with very few slides by repeating in order
  const baseImages = Array.isArray(images) ? images : []
  const minSlides = 4
  const effectiveImages = baseImages.length === 0
    ? []
    : baseImages.length < minSlides
      ? Array.from({ length: Math.ceil(minSlides / baseImages.length) }).flatMap(() => baseImages)
      : baseImages
  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 50px;
  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 400px;
    height: 280px;
    /* margin: 20px; */
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  
  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .swiper {
      padding-bottom: 30px;
    }
    
    .swiper-slide {
      width: 280px;
      height: 180px;
    }
  }
  
  /* Small mobile devices */
  @media (max-width: 480px) {
    .swiper-slide {
      width: 250px;
      height: 160px;
    }
  }
  `
  return (
    <section className="w-full">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-gary/5 p-2 shadow-sm md:rounded-t-[44px] sm:max-w-5xl">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-white dark:bg-[#0c0c0c] dark:border-white/20 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
          <Badge
            variant="outline"
            className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
          >
            <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
            Latest
          </Badge>
          {categories && categories.length > 0 && onChangeCategory && (
            <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2">
              <select
                value={selectedCategory ?? 'ALL'}
                onChange={(e) => onChangeCategory(e.target.value)}
                className="px-4 py-2 text-sm border border-border rounded-lg bg-white dark:bg-neutral-800 text-foreground focus:ring-2 focus:ring-ring focus:border-transparent min-w-[220px]"
              >
                <option value="ALL">ALL</option>
                {categories.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col justify-center pt-14 pb-2 pl-4 md:items-center">
            <div className="flex gap-2">
              <div>
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl opacity-85">
                  {title ?? 'Latest Projects'}
                </h3>
                <p className="text-sm sm:text-base">{subtitle ?? 'Our latest projects'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center items-center w-full">
            <div className="w-full">
              <Swiper
                dir="rtl"
                key={`carousel-${effectiveImages.length}`}
                spaceBetween={50}
                autoplay={{
                  // Step-wise autoplay so after last slide, it shows the first slide next
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                  stopOnLastSlide: false,
                  reverseDirection: true,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                loopAdditionalSlides={Math.max(2, effectiveImages.length)}
                loopPreventsSliding={false}
                observer={true}
                observeParents={true}
                watchOverflow={false}
                speed={700}
                slidesPerView={"auto"}
                allowTouchMove={true}
                simulateTouch={true}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }
                    : undefined
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                breakpoints={{
                  320: {
                    spaceBetween: 15,
                    slidesPerView: "auto",
                  },
                  480: {
                    spaceBetween: 20,
                    slidesPerView: "auto",
                  },
                  768: {
                    spaceBetween: 30,
                    slidesPerView: "auto",
                  },
                  1024: {
                    spaceBetween: 40,
                    slidesPerView: "auto",
                  },
                  1200: {
                    spaceBetween: 50,
                    slidesPerView: "auto",
                  }
                }}
              >
                {effectiveImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-3xl size-full">
                      {image.href ? (
                        <a href={image.href} target="_blank" rel="noreferrer">
                      <Image
                        src={image.src}
                        width={600}
                        height={400}
                        className="object-cover rounded-3xl size-full"
                        alt={image.alt}
                      />
                        </a>
                      ) : (
                      <Image
                        src={image.src}
                          width={600}
                          height={400}
                        className="object-cover rounded-3xl size-full"
                        alt={image.alt}
                      />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
