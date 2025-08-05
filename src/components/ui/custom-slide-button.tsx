"use client"

import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { Check, Loader2, SendHorizontal, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const DRAG_CONSTRAINTS = { left: 0, right: 155 }
const DRAG_THRESHOLD = 0.9

const BUTTON_STATES = {
  initial: { width: "12rem" },
  completed: { width: "8rem" },
}

const ANIMATION_CONFIG = {
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
}

type StatusIconProps = {
  status: string
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const iconMap: Record<StatusIconProps["status"], JSX.Element> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin text-white" size={20} />,
      success: <Check className="text-white" size={20} />,
      error: <X className="text-white" size={20} />,
    }),
    []
  )

  if (!iconMap[status]) return null

  return (
    <motion.div
      key={crypto.randomUUID()}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {iconMap[status]}
    </motion.div>
  )
}

interface CustomSlideButtonProps extends React.ComponentProps<typeof Button> {
  onSubmit?: () => Promise<void>
  isSubmitting?: boolean
}

const CustomSlideButton = forwardRef<HTMLButtonElement, CustomSlideButtonProps>(
  ({ className, onSubmit, isSubmitting = false, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const dragHandleRef = useRef<HTMLDivElement | null>(null)

    const dragX = useMotionValue(0)
    const springX = useSpring(dragX, ANIMATION_CONFIG.spring)
    const dragProgress = useTransform(
      springX,
      [0, DRAG_CONSTRAINTS.right],
      [0, 1]
    )

         const handleSubmit = useCallback(async () => {
       if (!onSubmit) return
       
       setStatus("loading")
       try {
         await onSubmit()
         setStatus("success")
         // Reset button after 3 seconds on success
         setTimeout(() => {
           setCompleted(false)
           setStatus("idle")
           dragX.set(0)
         }, 3000)
       } catch (error) {
         setStatus("error")
       }
     }, [onSubmit, dragX])

     const handleReset = useCallback(() => {
       setCompleted(false)
       setStatus("idle")
       dragX.set(0)
     }, [dragX])

    const handleDragStart = useCallback(() => {
      if (completed || isSubmitting) return
      setIsDragging(true)
    }, [completed, isSubmitting])

    const handleDragEnd = () => {
      setIsDragging(false)

      const progress = dragProgress.get()
      if (progress >= DRAG_THRESHOLD) {
        setCompleted(true)
        handleSubmit()
      } else {
        dragX.set(0)
      }
    }

    const handleDrag = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (completed || isSubmitting) return
      const newX = Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right))
      dragX.set(newX)
    }

    const adjustedWidth = useTransform(springX, (x) => x + 10)

         return (
       <motion.div
         animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
         transition={ANIMATION_CONFIG.spring}
         className="flex relative justify-center items-center h-12 bg-gray-100 rounded-full shadow-button-inset dark:shadow-button-inset-dark"
       >
         {/* Background progress bar */}
         {!completed && (
           <motion.div
             style={{
               width: adjustedWidth,
             }}
             className="absolute inset-y-0 left-0 z-0 rounded-full bg-gradient-to-r from-[#EEBDE0] to-[#D4A5C7]"
           />
         )}

         {/* Text label */}
         <AnimatePresence mode="wait">
           {!completed && (
             <motion.div
               key="slide-text"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute z-5 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
             >
               {isDragging ? "Sending..." : "Slide to send"}
             </motion.div>
           )}
         </AnimatePresence>

         {/* Drag handle */}
         <AnimatePresence key={crypto.randomUUID()}>
           {!completed && (
             <motion.div
               ref={dragHandleRef}
               drag="x"
               dragConstraints={DRAG_CONSTRAINTS}
               dragElastic={0.05}
               dragMomentum={false}
               onDragStart={handleDragStart}
               onDragEnd={handleDragEnd}
               onDrag={handleDrag}
               style={{ x: springX }}
               className="flex absolute -left-4 z-10 justify-start items-center cursor-grab active:cursor-grabbing"
             >
               <Button
                 ref={ref}
                 disabled={isSubmitting || status === "loading"}
                 {...props}
                 size="icon"
                 className={cn(
                   "shadow-button rounded-full drop-shadow-xl bg-white dark:bg-gray-800",
                   isDragging && "scale-105 transition-transform",
                   className
                 )}
               >
                 <SendHorizontal className="size-4 text-gray-700 dark:text-gray-300" />
               </Button>
             </motion.div>
           )}
         </AnimatePresence>

                   {/* Success/Error state */}
          <AnimatePresence key={crypto.randomUUID()}>
            {completed && (
              <motion.div
                className="flex absolute inset-0 justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  ref={ref}
                  disabled={isSubmitting || status === "loading"}
                  onClick={status === "error" ? handleReset : undefined}
                  {...props}
                  className={cn(
                    "rounded-full transition-all duration-300 size-full",
                    status === "success" && "bg-green-500 hover:bg-green-600",
                    status === "error" && "bg-red-500 hover:bg-red-600 cursor-pointer",
                    status === "loading" && "bg-blue-500 hover:bg-blue-600",
                    className
                  )}
                >
                  <AnimatePresence key={crypto.randomUUID()} mode="wait">
                    <StatusIcon status={status} />
                  </AnimatePresence>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
       </motion.div>
     )
  }
)

CustomSlideButton.displayName = "CustomSlideButton"

export { CustomSlideButton } 