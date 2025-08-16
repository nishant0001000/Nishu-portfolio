import React, { useEffect, useState } from 'react'
import { CardCarousel } from '../ui/card-carousel'

interface DbProject {
  _id: string
  title: string
  imageUrl: string
  link?: string
  category?: string
}

const CardCarouselParent = () => {
  const [projects, setProjects] = useState<DbProject[]>([])
  const [categories, setCategories] = useState<Record<string, unknown>[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' })
        const json = await res.json()
        if (json?.success && Array.isArray(json.data)) {
          setProjects(json.data as DbProject[])
        } else {
          setProjects([])
        }
      } catch (e) {
        setProjects([])
      }
    }
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' })
        const json = await res.json()
        if (json?.success && Array.isArray(json.data)) {
          setCategories(json.data)
        } else {
          setCategories([])
        }
      } catch (e) {
        setCategories([])
      }
    }
    loadProjects()
    loadCategories()
  }, [])

  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

  const images = filteredProjects.map(p => ({ src: p.imageUrl, alt: p.title || 'Project', href: p.link }))

  const title = selectedCategory === 'ALL' ? 'ALL Projects' : `${selectedCategory} Projects`
  const subtitle = selectedCategory === 'ALL'
    ? 'Our ALL Projects'
    : `${selectedCategory} Projects (${filteredProjects.length} of ${projects.length})`

  return (
    <div className="w-full">
      <CardCarousel
        images={images}
        showPagination={false}
        autoplayDelay={1000}
        title={title}
        subtitle={subtitle}
        categories={categories.map((c: Record<string, unknown>) => String(c.name))}
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
      />
    </div>
  )
}

export default CardCarouselParent