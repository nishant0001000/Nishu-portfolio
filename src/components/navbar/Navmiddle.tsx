"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { useOnClickOutside } from "usehooks-ts"

import { cn } from "@/lib/utils"

// Import icons at the top
import { User, Mail, Star } from "lucide-react"

// Custom Laptop Minimal Icon
const LaptopMinimal = ({ className, size = 20 }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="12" x="3" y="4" rx="2" ry="2"/>
    <line x1="2" x2="22" y1="20" y2="20"/>
  </svg>
)

interface Tab {
  title: string
  icon: LucideIcon | React.ComponentType<{ className?: string; size?: number }>
  type?: never
}

interface Separator {
  type: "separator"
  title?: never
  icon?: never
}

type TabItem = Tab | Separator

interface ExpandedTabsProps {
  tabs: TabItem[]
  className?: string
  activeColor?: string
  onChange?: (index: number | null) => void
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
}

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
}

const transition = { delay: 0.1, type: "spring" as const, bounce: 0, duration: 0.6 }

export function ExpandedTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
}: ExpandedTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(null)
  const outsideClickRef = React.useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement
  )

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null)
    onChange?.(null)
  })

  const handleSelect = (index: number) => {
    setSelected(index)
    onChange?.(index)
  }

  const Separator = () => (
    <div className=" h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  )

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-purple-300/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
      <div
        ref={outsideClickRef}
        className={cn(
          "relative flex gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-xl p-1 shadow-2xl overflow-hidden",
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-full"></div>
        <div className="relative z-10 flex gap-2">
          {tabs.map((tab, index) => {
            if (tab.type === "separator") {
              return <Separator key={`separator-${index}`} />
            }

            const Icon = tab.icon
            return (
              <motion.button
                key={tab.title}
                variants={buttonVariants}
                initial={false}
                animate="animate"
                custom={selected === index}
                onClick={() => handleSelect(index)}
                transition={transition}
                className={cn(
                  "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 backdrop-blur-sm",
                  selected === index
                    ? cn("bg-black/20 dark:bg-white/20 text-black dark:text-white shadow-lg", activeColor)
                    : "text-black/80 dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white hover:shadow-md"
                )}
              >
                <Icon size={20} />
                <AnimatePresence initial={false}>
                  {selected === index && (
                    <motion.span
                      variants={spanVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={transition}
                      className="overflow-hidden"
                    >
                      {tab.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function CustomColorDemo() {
  const tabs: TabItem[] = [
    { title: "About", icon: User },
    { title: "Contact", icon: Mail },
    { type: "separator" },
    { title: "Services", icon: LaptopMinimal },
    { title: "Skills", icon: Star },
  ]

  return (
    <div className="flex flex-col gap-4">
      <ExpandedTabs
        tabs={tabs}
        activeColor="text-black dark:text-white"
        className="border-black/20 dark:border-white/20"
      />
    </div>
  )
}
