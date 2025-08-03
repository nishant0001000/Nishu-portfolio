"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bot, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatResponseProps {
  message: string
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  modelUsed?: string
  showModelButtons?: boolean
  onModelSelect?: (model: 'local' | 'gemini' | 'deepseek' | 'grok') => void
}

export default function ChatResponse({ 
  message, 
  isLoading = false, 
  isError = false, 
  errorMessage,
  modelUsed,
  showModelButtons = false,
  onModelSelect
}: ChatResponseProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 items-start p-4 rounded-2xl border bg-white/5 dark:bg-black/5 border-black/10 dark:border-white/10"
      >
        <div className="flex-shrink-0 w-8 h-8 bg-[#ff3f17]/15 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-[#ff3f17]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-center mb-2">
            <span className="text-sm font-medium text-black dark:text-white">Nishu</span>
            <Loader2 className="w-4 h-4 animate-spin text-[#ff3f17]" />
          </div>
          <p className="text-sm text-black/70 dark:text-white/70">Thinking...</p>
        </div>
      </motion.div>
    )
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 items-start p-4 rounded-2xl border bg-red-500/10 border-red-500/20"
      >
        <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-full bg-red-500/15">
          <Bot className="w-4 h-4 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-center mb-2">
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Error</span>
          </div>
          <p className="text-sm text-red-600/80 dark:text-red-400/80">
            {errorMessage || "Something went wrong. Please try again."}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex gap-3 items-start p-4 rounded-2xl border bg-white/5 dark:bg-black/5 border-black/10 dark:border-white/10"
        >
          <div className="flex-shrink-0 w-8 h-8 bg-[#ff3f17]/15 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#ff3f17]" />
          </div>
          <div className="flex-1 min-w-0">
                      <div className="flex gap-2 items-center mb-2">
            <span className="text-sm font-medium text-black dark:text-white">Nishu</span>
          </div>
          {modelUsed && (
            <div className="flex gap-1 items-center mb-2 text-xs text-black/60 dark:text-white/60">
              ⚡ Powered by: {modelUsed}
            </div>
          )}
          <p className="mb-3 text-sm leading-relaxed text-black/80 dark:text-white/80">
            {message}
          </p>
          
          {showModelButtons && onModelSelect && (
            <div className="space-y-2">
              <p className="mb-2 text-xs text-black/60 dark:text-white/60">Choose your AI assistant:</p>
              <div className="flex flex-col gap-2">
                                 <button
                   onClick={() => onModelSelect('local')}
                   className="flex items-center gap-3 p-3 rounded-lg border border-[#ff3f17]/20 bg-[#ff3f17]/5 hover:bg-[#ff3f17]/10 transition-colors text-left"
                 >
                   <div className="w-3 h-3 rounded-full bg-[#ff3f17]"></div>
                   <div>
                     <div className="text-sm font-medium text-[#ff3f17]">Local AI</div>
                     <div className="text-xs text-black/60 dark:text-white/60">Portfolio information &amp; Nishant&apos;s details</div>
                   </div>
                                       </button>
                                             <button
                         onClick={() => onModelSelect('gemini')}
                         className="flex gap-3 items-center p-3 text-left rounded-lg border transition-colors border-green-500/20 bg-green-500/5 hover:bg-green-500/10"
                       >
                         <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                         <div>
                           <div className="text-sm font-medium text-green-500">Nishu AI</div>
                           <div className="text-xs text-black/60 dark:text-white/60">Gemma 3N E2B</div>
                         </div>
                       </button>
                       <button
                         onClick={() => onModelSelect('deepseek')}
                         className="flex gap-3 items-center p-3 text-left rounded-lg border transition-colors border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10"
                       >
                         <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                         <div>
                           <div className="text-sm font-medium text-blue-500">Nishu 2.0</div>
                           <div className="text-xs text-black/60 dark:text-white/60">Mistral Small</div>
                         </div>
                       </button>
                       <button
                         onClick={() => onModelSelect('grok')}
                         className="flex gap-3 items-center p-3 text-left rounded-lg border transition-colors border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10"
                       >
                         <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                         <div>
                           <div className="text-sm font-medium text-purple-500">Nishu 3.0</div>
                           <div className="text-xs text-black/60 dark:text-white/60">Qwen3 Coder</div>
                         </div>
                       </button>

                       

                </div>
            </div>
          )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 