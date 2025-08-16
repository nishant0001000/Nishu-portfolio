'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import MinimalCard, { MinimalCardDescription, MinimalCardImage, MinimalCardTitle } from '../ui/minimal-card'
import { Badge } from "@/components/ui/badge"
import { SparklesIcon } from "lucide-react"

const TemplateCard = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [scrollbarPosition, setScrollbarPosition] = useState(0);
    const [horizontalScrollProgress, setHorizontalScrollProgress] = useState(0);

    type DbProject = {
        _id: string
        title: string
        description: string
        technologies: string[]
        link?: string
        imageUrl: string
        category?: string
    }

    const [projects, setProjects] = useState<DbProject[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<DbProject | null>(null)
    const [categories, setCategories] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true)
                const res = await fetch('/api/projects')
                const data = await res.json()
                if (data?.success && Array.isArray(data.data)) {
                    setProjects(data.data)
                } else {
                    setProjects([])
                }
            } catch (e) {
                setProjects([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchProjects()
    }, [])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                if (data?.success && Array.isArray(data.data)) {
                    setCategories(data.data)
                } else {
                    setCategories([])
                }
            } catch (e) {
                setCategories([])
            }
        }
        fetchCategories()
    }, [])

    // Filter projects based on selected category
    const filteredProjects = selectedCategory === 'all' 
        ? projects 
        : projects.filter(project => project.category === selectedCategory)


    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current || !scrollbarRef.current) return;

        const scrollbarTrack = scrollbarRef.current.parentElement;
        if (!scrollbarTrack) return;

        const trackRect = scrollbarTrack.getBoundingClientRect();
        const scrollbarHeight = 48; // Fixed height for scrollbar

        const mouseY = e.clientY - trackRect.top;
        const maxScrollbarTop = trackRect.height - scrollbarHeight;
        const newScrollbarTop = Math.max(0, Math.min(mouseY - scrollbarHeight / 2, maxScrollbarTop));

        const scrollPercentage = newScrollbarTop / maxScrollbarTop;
        const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
        const newScrollTop = scrollPercentage * maxScroll;

        // Direct smooth scrolling without complex animation
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = newScrollTop;
        }

        setScrollbarPosition(newScrollbarTop);
    }, [isDragging]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove]);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

                // Handle vertical scrolling for desktop
                if (scrollbarRef.current) {
                    const maxScroll = scrollHeight - clientHeight;
                    const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;

                    const scrollbarTrack = scrollbarRef.current.parentElement;
                    if (scrollbarTrack) {
                        const trackHeight = scrollbarTrack.clientHeight;
                        const scrollbarHeight = 48; // Fixed height for scrollbar
                        const maxScrollbarTop = trackHeight - scrollbarHeight;
                        const newScrollbarTop = scrollPercentage * maxScrollbarTop;

                        // Immediate position update for better responsiveness
                        setScrollbarPosition(newScrollbarTop);
                    }
                }

                // Handle horizontal scrolling for mobile
                const maxHorizontalScroll = scrollWidth - clientWidth;
                const horizontalScrollPercentage = maxHorizontalScroll > 0 ? scrollLeft / maxHorizontalScroll : 0;
                // Invert direction: when cards scroll left, logo moves right
                const invertedProgress = 100 - (horizontalScrollPercentage * 100);
                setHorizontalScrollProgress(invertedProgress);

            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (

        <div className="w-full flex flex-col items-center mt-[3rem] sm:mt-[4rem] lg:mt-[5rem]">

            {/* Heading above TemplateCard */}
            <div className="px-4 mb-12 text-center sm:mb-16 lg:mb-20">
                <h2 className="mb-2 text-xl font-bold text-black sm:text-2xl dark:text-white">Drag logo to scroll projects</h2>
                <div className="mx-auto w-12 h-1 bg-gradient-to-r from-blue-500 via-pink-500 to-white rounded-full sm:w-16"></div>
            </div>

            {/* Image below heading */}
            <svg
                width="100"
                height="80"
                viewBox="0 0 100 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-[-3rem] mb-4 sm:mb-6 lg:mb-8 fill-black dark:fill-white sm:w-20 sm:h-10 lg:w-24 lg:h-12"
            >
                <path d="M68.6958 5.40679C67.3329 12.7082 68.5287 20.1216 68.5197 27.4583C68.5189 29.5382 68.404 31.6054 68.1147 33.682C67.9844 34.592 69.4111 34.751 69.5414 33.8411C70.5618 26.5016 69.2488 19.104 69.4639 11.7325C69.5218 9.65887 69.7222 7.6012 70.0939 5.56265C70.1638 5.1949 69.831 4.81112 69.4601 4.76976C69.0891 4.72841 68.7689 5.01049 68.6958 5.40679Z"></path>
                <path d="M74.0117 26.1349C73.2662 27.1206 72.5493 28.1096 72.0194 29.235C71.5688 30.167 71.2007 31.137 70.7216 32.0658C70.4995 32.5033 70.252 32.9091 69.9475 33.3085C69.8142 33.4669 69.6779 33.654 69.5161 33.8093C69.4527 33.86 68.9199 34.2339 68.9167 34.2624C68.9263 34.1768 69.0752 34.3957 69.0055 34.2434C68.958 34.1515 68.8534 34.0531 68.8058 33.9612C68.6347 33.6821 68.4637 33.403 68.264 33.1208L67.1612 31.3512C66.3532 30.0477 65.5199 28.7126 64.7119 27.4093C64.5185 27.0699 63.9701 27.0666 63.7131 27.2979C63.396 27.5514 63.4053 27.9858 63.6018 28.2966C64.3845 29.5683 65.1956 30.8431 65.9783 32.1149L67.1572 33.9796C67.5025 34.5093 67.8225 35.2671 68.428 35.5368C69.6136 36.0446 70.7841 34.615 71.3424 33.7529C71.9992 32.786 72.4085 31.705 72.9035 30.6336C73.4842 29.3116 74.2774 28.1578 75.1306 26.9818C75.7047 26.2369 74.5573 25.3868 74.0117 26.1349ZM55.1301 12.2849C54.6936 18.274 54.6565 24.3076 55.0284 30.3003C55.1293 31.987 55.2555 33.7056 55.4419 35.4019C55.5431 36.3087 56.9541 36.0905 56.8529 35.1837C56.2654 29.3115 56.0868 23.3982 56.2824 17.4978C56.3528 15.8301 56.4263 14.1339 56.5537 12.4725C56.6301 11.5276 55.2034 11.3686 55.1301 12.2849Z"></path>
                <path d="M59.2642 30.6571C58.8264 31.475 58.36 32.2896 57.9222 33.1075C57.7032 33.5164 57.4843 33.9253 57.2369 34.3311C57.0528 34.6861 56.8656 35.0697 56.6278 35.3898C56.596 35.4152 56.5611 35.4691 56.5294 35.4944C56.4881 35.6054 56.5041 35.4627 56.5548 35.5261C56.7481 35.6055 56.8337 35.6151 56.7545 35.5484L56.6784 35.4533C56.6023 35.3581 56.5263 35.263 56.4534 35.1393C56.1778 34.7619 55.8734 34.3814 55.5946 34.0324C55.0146 33.2744 54.4315 32.545 53.8515 31.787C53.2685 31.0576 52.1584 31.945 52.7415 32.6744C53.4229 33.5592 54.1042 34.4441 54.7888 35.3004C55.1184 35.7127 55.4321 36.2677 55.8569 36.6039C56.3069 36.9719 56.884 36.9784 57.3533 36.6551C57.7624 36.3542 57.9845 35.9167 58.2067 35.4792C58.4636 34.9878 58.746 34.5282 59.003 34.0369C59.5423 33.0859 60.0563 32.1032 60.5957 31.1522C60.7765 30.8257 60.5104 30.3627 60.2092 30.2135C59.8161 30.112 59.4451 30.3305 59.2642 30.6571ZM44.5918 10.1569L42.2324 37.5406C42.0032 40.1151 41.8057 42.6641 41.5764 45.2386C41.5032 46.1549 42.9299 46.314 43.0032 45.3977L45.3626 18.014C45.5918 15.4396 45.7893 12.8905 46.0186 10.316C46.1235 9.37433 44.6968 9.21532 44.5918 10.1569Z"></path>
                <path d="M48.101 37.7616C46.7404 38.8232 45.8267 40.2814 44.9163 41.7109C44.0407 43.0866 43.1365 44.4592 41.738 45.3434C42.1247 45.5019 42.5146 45.6321 42.9014 45.7908C42.1324 41.8051 41.04 37.8699 39.6781 34.0203C39.545 33.6589 39.0695 33.5191 38.7365 33.6553C38.3719 33.817 38.2385 34.2353 38.3716 34.5969C39.7209 38.3007 40.7404 42.1121 41.4904 46.009C41.6012 46.5703 42.1877 46.7512 42.6539 46.4565C45.5462 44.6124 46.3877 40.9506 49.0169 38.8748C49.7178 38.2884 48.8304 37.1784 48.101 37.7616ZM25.9671 13.1014C25.7028 16.2497 26.0758 19.3824 26.5091 22.4929C26.9645 25.6636 27.4166 28.863 27.872 32.0337C28.1346 33.8253 28.3971 35.6167 28.631 37.4051C28.7607 38.3151 30.1717 38.0968 30.042 37.1868C29.5866 34.016 29.1281 30.8738 28.7012 27.7062C28.2647 24.6242 27.7396 21.5612 27.449 18.4666C27.2943 16.7449 27.2283 15.0042 27.3653 13.2572C27.4671 12.3442 26.0404 12.1851 25.9671 13.1014Z"></path>
                <path d="M30.5625 27.3357C29.9525 30.7343 29.3425 34.133 28.704 37.5284C29.1225 37.4018 29.5411 37.2751 29.9882 37.1516C28.6034 35.0617 27.2504 32.9465 25.8655 30.8565C25.6406 30.5425 25.1523 30.517 24.8669 30.7451C24.5497 30.9987 24.5305 31.4299 24.7555 31.7439C26.1403 33.8338 27.4933 35.9491 28.8781 38.039C29.2489 38.6003 30.0417 38.2265 30.1624 37.6621C30.7724 34.2635 31.3824 30.8648 32.0209 27.4694C32.0908 27.1016 31.758 26.7178 31.3871 26.6765C30.9559 26.6573 30.6324 26.9679 30.5625 27.3357Z"></path>
            </svg>

            <div className="mx-auto w-full max-w-5xl rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] border border-white/20 p-1 sm:p-2 shadow-sm md:rounded-t-[32px] lg:md:rounded-t-[44px]">

                <div className="relative mx-auto flex w-full flex-col rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] border border-black/5 bg-white dark:bg-[#21212156] p-1 sm:p-2 shadow-sm md:items-center md:gap-6 lg:md:gap-8 md:rounded-b-[16px] lg:md:rounded-b-[20px] md:rounded-t-[32px] lg:md:rounded-t-[40px]">

                    <Badge
                        variant="outline"
                        className="absolute left-3 sm:left-4 top-4 sm:top-6 rounded-[12px] sm:rounded-[14px] border border-black/10 text-sm sm:text-base md:left-6"
                    >
                        <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
                        Latest
                    </Badge>

                    <div className="flex flex-col justify-center pt-10 pb-2 pl-3 sm:pl-4 sm:pt-12 lg:pt-14 md:items-center">
                        <div className="flex gap-2">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-4xl opacity-85 dark:text-white">
                                    All Projects
                                </h3>
                                <p className="text-sm sm:text-base text-black/70 dark:text-white/70">
                                    {selectedCategory === 'all' 
                                        ? `Our All Projects (${projects.length})`
                                        : `${selectedCategory} Projects (${filteredProjects.length} of ${projects.length})`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex justify-center mb-6">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 text-sm border border-border rounded-lg bg-white dark:bg-neutral-800 text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                            style={{ 
                              direction: 'rtl',
                              transform: 'scaleY(-1)'
                            }}
                        >
                            <option value="all" style={{ 
                              direction: 'ltr',
                              transform: 'scaleY(-1)'
                            }}>All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name} style={{ 
                                  direction: 'ltr',
                                  transform: 'scaleY(-1)'
                                }}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 lg:gap-4 max-h-[800px] sm:max-h-[1000px] lg:max-h-[1200px] overflow-x-auto sm:overflow-y-auto scroll-smooth px-4 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            scrollBehavior: 'smooth'
                        }}
                    >
                        {isLoading && (
                            <div className="py-8 text-sm text-neutral-500 col-span-full text-center">Loading projects…</div>
                        )}
                        {!isLoading && filteredProjects.length === 0 && (
                            <div className="py-8 text-sm text-neutral-500 col-span-full text-center">
                                {selectedCategory === 'all' 
                                    ? 'No projects found.'
                                    : `No projects found in ${selectedCategory} category.`
                                }
                            </div>
                        )}
                        {!isLoading && filteredProjects.map((project, index) => (
                            <MinimalCard
                                className="ml-0 mr-2 sm:m-2 w-[300px] sm:w-[320px] lg:w-[350px] flex-shrink-0 transform transition-all duration-700 ease-out hover:scale-105 hover:rotate-1"
                                key={String(project._id)}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    filter: 'sepia(0.1) contrast(1.1) brightness(0.95)'
                                }}
                            >
                                <MinimalCardImage
                                    className="h-[200px] sm:h-[280px] lg:h-[320px]"
                                    src={project.imageUrl}
                                    alt={project.title}
                                />
                                <MinimalCardTitle>{project.title}</MinimalCardTitle>
                                <div className="relative">
                                    <MinimalCardDescription
                                        className="line-clamp-2 min-h-[2.8em]"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            lineHeight: '1.4em',
                                            maxHeight: '2.8em',
                                            height: '2.8em'
                                        }}
                                    >
                                        {project.description}
                                    </MinimalCardDescription>
                                    <div className="absolute bottom-0 right-0 w-8 h-4 bg-gradient-to-l from-neutral-50 dark:from-neutral-800 to-transparent pointer-events-none"></div>
                                    <div className="absolute bottom-1 right-1 text-xs text-neutral-400 dark:text-neutral-500 pointer-events-none">...</div>
                                </div>
                                
                                {/* Category Badge */}
                                {project.category && (
                                    <div className="px-1 mt-2">
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                                            📁 {project.category}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="flex flex-wrap gap-2 px-1 mt-3">
                                    {(Array.isArray(project.technologies) ? project.technologies : []).map((tech, i) => {
                                        const colors = [
                                            'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300/30',
                                            'bg-green-500/20 text-green-700 dark:text-green-300 border-green-300/30',
                                            'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300/30',
                                            'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300/30',
                                            'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-300/30',
                                            'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300/30',
                                            'bg-red-500/20 text-red-700 dark:text-red-300 border-red-300/30',
                                            'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300/30',
                                            'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300/30',
                                            'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300/30'
                                        ];
                                        const colorClass = colors[i % colors.length];
                                        return (
                                            <span
                                                key={i}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-full border ${colorClass} transition-all duration-200 hover:scale-105 hover:shadow-sm`}
                                            >
                                                {tech}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Details/Visit Buttons */}
                                <div className="px-1 mt-4 flex gap-2">
                                    <button
                                        className="relative w-full h-10 bg-gradient-to-r from-black/10 dark:from-white/10 to-black/5 dark:to-white/5 backdrop-blur-sm border border-black/20 dark:border-white/20 rounded-[15px] mb-1 cursor-pointer transition-all duration-300 hover:from-black/20 dark:hover:from-white/20 hover:to-black/10 dark:hover:to-white/10 group overflow-hidden"
                                        onClick={() => { setSelectedProject(project); setDetailsOpen(true); }}
                                    >
                                        <span className="relative z-10 text-sm font-medium text-black dark:text-white">View Details</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 ease-out -translate-x-full via-black/20 dark:via-white/20 group-hover:translate-x-full"></div>
                                    </button>
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="relative w-full h-10 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-[15px] mb-1 cursor-pointer transition-all duration-300 hover:bg-blue-500/20 flex items-center justify-center"
                                        >
                                            <span className="relative z-10 text-sm font-medium text-blue-700 dark:text-blue-300">Visit</span>
                                        </a>
                                    )}
                                </div>
                            </MinimalCard>
                        ))}
                    </div>

                    {/* Simple Horizontal Scrollbar for Mobile */}
                    <div className="block px-4 mt-4 sm:hidden">
                        <div className="relative w-full h-12">
                            {/* Logo handle */}
                            <div
                                className="absolute top-2 w-8 h-8 bg-gradient-to-r from-[#000000] to-[#000000] rounded-full cursor-pointer hover:from-[#D4A5C7] hover:to-[#EEBDE0] transition-all duration-300 shadow-sm hover:shadow-md"
                                style={{
                                    left: `${Math.max(0, Math.min(horizontalScrollProgress, 100 - 8))}%`
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const scrollbarTrack = e.currentTarget.parentElement;
                                    if (!scrollbarTrack || !scrollContainerRef.current) return;

                                    const trackRect = scrollbarTrack.getBoundingClientRect();
                                    const logoWidth = 32; // 8 * 4 (w-8 = 32px)

                                    const handleMouseMove = (e: MouseEvent) => {
                                        const mouseX = e.clientX - trackRect.left;
                                        const maxScrollbarLeft = trackRect.width - logoWidth;
                                        const newScrollbarLeft = Math.max(0, Math.min(mouseX - logoWidth / 2, maxScrollbarLeft));

                                        // Invert the scroll direction to match logo movement
                                        const scrollPercentage = 1 - (newScrollbarLeft / maxScrollbarLeft);
                                        const maxScroll = scrollContainerRef.current!.scrollWidth - scrollContainerRef.current!.clientWidth;
                                        scrollContainerRef.current!.scrollLeft = scrollPercentage * maxScroll;
                                    };

                                    const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                    };

                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                                onTouchStart={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const scrollbarTrack = e.currentTarget.parentElement;
                                    if (!scrollbarTrack || !scrollContainerRef.current) return;

                                    const trackRect = scrollbarTrack.getBoundingClientRect();
                                    const logoWidth = 32; // 8 * 4 (w-8 = 32px)

                                    const handleTouchMove = (e: TouchEvent) => {
                                        e.preventDefault();
                                        const touchX = e.touches[0].clientX - trackRect.left;
                                        const maxScrollbarLeft = trackRect.width - logoWidth;
                                        const newScrollbarLeft = Math.max(0, Math.min(touchX - logoWidth / 2, maxScrollbarLeft));

                                        // Invert the scroll direction to match logo movement
                                        const scrollPercentage = 1 - (newScrollbarLeft / maxScrollbarLeft);
                                        const maxScroll = scrollContainerRef.current!.scrollWidth - scrollContainerRef.current!.clientWidth;
                                        scrollContainerRef.current!.scrollLeft = scrollPercentage * maxScroll;
                                    };

                                    const handleTouchEnd = () => {
                                        document.removeEventListener('touchmove', handleTouchMove);
                                        document.removeEventListener('touchend', handleTouchEnd);
                                    };

                                    document.addEventListener('touchmove', handleTouchMove, { passive: false });
                                    document.addEventListener('touchend', handleTouchEnd);
                                }}
                            >
                                <div className="flex justify-center items-center w-full h-full">
                                    <video
                                        src="https://res.cloudinary.com/dbtymafqf/video/upload/v1754257529/m-logodark1_pphxjz.mp4"
                                        width={28}
                                        height={28}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Draggable Scrollbar - Right Side */}
                    <div className="hidden absolute bottom-6 right-8 top-32 w-2 bg-gray-100 rounded-full sm:right-8 lg:right-8 sm:top-36 lg:top-40 sm:bottom-8 lg:bottom-10 sm:w-3 dark:bg-black/10 sm:block">
                        <div
                            ref={scrollbarRef}
                            className="w-8 h-8 bg-gradient-to-br rounded-full border shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer sm:w-10 sm:h-10 lg:w-12 lg:h-12 from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 border-white/20 hover:shadow-xl group"
                            style={{
                                top: `${scrollbarPosition}px`,
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)'
                            }}
                            onMouseDown={handleMouseDown}
                        >
                            <div className="flex overflow-hidden relative justify-center items-center w-full h-full bg-black rounded-full">
                                <video
                                    src="https://res.cloudinary.com/nishantcloud/video/upload/v1754257529/m-logodark1_pphxjz.mp4"
                                    width={35}
                                    height={35}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className={`rounded-lg`}
                                />
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 ease-out -translate-x-full via-white/20 group-hover:translate-x-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Draggable Scrollbar - Left Side */}
                    <div className="hidden absolute bottom-6 left-8 top-32 w-2 bg-gray-100 rounded-full sm:left-8 lg:left-8 sm:top-36 lg:top-40 sm:bottom-8 lg:bottom-10 sm:w-3 dark:bg-black/10 sm:block">
                        <div
                            className="w-8 h-8 bg-gradient-to-br rounded-full border shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer sm:w-10 sm:h-10 lg:w-12 lg:h-12 from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 border-white/20 hover:shadow-xl group"
                            style={{
                                top: `${scrollbarPosition}px`,
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)'
                            }}
                            onMouseDown={handleMouseDown}
                        >
                            <div className="flex overflow-hidden relative justify-center items-center w-full h-full bg-black rounded-full">
                                <video
                                    src="https://res.cloudinary.com/nishantcloud/video/upload/v1754257529/m-logodark1_pphxjz.mp4"
                                    width={35}
                                    height={35}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className={`rounded-lg`}
                                />
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent transition-transform duration-1000 ease-out -translate-x-full via-white/20 group-hover:translate-x-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {detailsOpen && selectedProject && (
                <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 p-4" onClick={() => setDetailsOpen(false)}>
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative transform transition-all duration-300 ease-out scale-100" onClick={(e) => e.stopPropagation()}>
                        <button aria-label="Close" className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10" onClick={() => setDetailsOpen(false)}>✕</button>
                        <div className="relative w-full h-56 sm:h-72 rounded-lg overflow-hidden mb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{selectedProject.title}</h3>
                        <div className="mb-4">
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 modal-text-wrap leading-relaxed">{selectedProject.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(Array.isArray(selectedProject.technologies) ? selectedProject.technologies : []).map((tech, i) => {
                                const colors = [
                                    'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300/30',
                                    'bg-green-500/20 text-green-700 dark:text-green-300 border-green-300/30',
                                    'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300/30',
                                    'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300/30',
                                    'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-300/30',
                                    'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300/30',
                                    'bg-red-500/20 text-red-700 dark:text-red-300 border-red-300/30',
                                    'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300/30',
                                    'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300/30',
                                    'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300/30'
                                ];
                                const colorClass = colors[i % colors.length];
                                return (
                                    <span
                                        key={i}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full border ${colorClass} transition-all duration-200 hover:scale-105 hover:shadow-sm`}
                                    >
                                        {tech}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 h-10 bg-gradient-to-r from-black/10 dark:from-white/10 to-black/5 dark:to-white/5 backdrop-blur-sm border border-black/20 dark:border-white/20 rounded-[12px] cursor-pointer transition-all duration-300 hover:from-black/20 dark:hover:from-white/20 hover:to-black/10 dark:hover:to-white/10" onClick={() => setDetailsOpen(false)}>
                                Close
                            </button>
                            {selectedProject.link && (
                                <a href={selectedProject.link} target="_blank" rel="noreferrer" className="px-4 h-10 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-[12px] cursor-pointer transition-all duration-300 hover:bg-blue-500/20 flex items-center justify-center text-blue-700 dark:text-blue-300">
                                    Visit
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TemplateCard