"use client"

import React from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { SparklesIcon } from "lucide-react"
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules"

import { Badge } from "@/components/ui/badge"

interface CarouselProps {
  images: { src: string; alt: string }[]
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
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
                     <div className="flex flex-col justify-center pt-14 pb-2 pl-4 md:items-center">
             <div className="flex gap-2">
               <div>
                                   <h3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl opacity-85">
                    Latest Projects
                  </h3>
                  <p className="text-sm sm:text-base">Our latest projects</p>
               </div>
             </div>
           </div>

           <div className="flex gap-4 justify-center items-center w-full">
            <div className="w-full">
                             <Swiper
                 spaceBetween={50}
                 autoplay={{
                   delay: autoplayDelay,
                   disableOnInteraction: false,
                 }}
                 effect={"coverflow"}
                 grabCursor={true}
                 centeredSlides={true}
                 loop={true}
                 slidesPerView={"auto"}
                 coverflowEffect={{
                   rotate: 0,
                   stretch: 0,
                   depth: 100,
                   modifier: 2.5,
                 }}
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
                {images.map((image, index) => (
                                     <SwiperSlide key={index}>
                                           <div className="rounded-3xl size-full">
                        <Image
                          src={image.src}
                          width={600}
                          height={400}
                          className="object-cover rounded-3xl size-full"
                          alt={image.alt}
                        />
                      </div>
                   </SwiperSlide>
                 ))}
                 {images.map((image, index) => (
                   <SwiperSlide key={index}>
                                           <div className="rounded-3xl size-full">
                        <Image
                          src={image.src}
                          width={300}
                          height={200}
                          className="object-cover rounded-3xl size-full"
                          alt={image.alt}
                        />
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
