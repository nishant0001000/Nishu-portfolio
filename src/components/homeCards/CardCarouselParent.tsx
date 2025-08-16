import React, { useEffect, useState } from 'react'
import { CardCarousel } from '../ui/card-carousel'

interface DbProject {
  _id: string
  title: string
  imageUrl: string
  link?: string
}

const CardCarouselParent = () => {
  const [images, setImages] = useState<{ src: string; alt: string; href?: string }[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' })
        const json = await res.json()
        if (json?.success && Array.isArray(json.data)) {
          const latest = (json.data as DbProject[]).slice(0, 4)
          setImages(
            latest.map(p => ({ src: p.imageUrl, alt: p.title || 'Project', href: p.link }))
          )
        } else {
          setImages([])
        }
      } catch (e) {
        setImages([])
      }
    }
    load()
  }, [])

  return (
    <div>
        <CardCarousel images={images} showPagination={false} />
    </div>
  )
}

export default CardCarouselParent