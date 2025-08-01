"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Tab {
  title: string
  icon: React.ComponentType<{ className?: string }>
  type?: "separator"
}

interface ExpandedTabsProps {
  tabs: Tab[]
  activeColor?: string
  className?: string
}

export function ExpandedTabs({ tabs, activeColor = "text-orange-500", className }: ExpandedTabsProps) {
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-white/10 p-1 backdrop-blur-sm border border-white/20", className)}>
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return (
            <div
              key={`separator-${index}`}
              className="h-6 w-px bg-white/20 mx-1"
            />
          )
        }

        const Icon = tab.icon
        const isActive = activeTab === index

        return (
          <button
            key={tab.title}
            onClick={() => setActiveTab(index)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              "hover:bg-white/10 hover:text-white",
              isActive 
                ? `${activeColor} bg-white/20 shadow-sm` 
                : "text-white/70"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.title}</span>
          </button>
        )
      })}
    </div>
  )
} 