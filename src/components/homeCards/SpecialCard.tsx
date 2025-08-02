import { SparklesIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { SkiperCard } from "../ui/skiper-card"

// Using available images from public/images directory
const shiftCard = "/images/card1.webp"
const family = "/images/card2.webp"
const carousel = "/images/card3.webp"
const textureFull = "/images/card4.webp"
const skiper = "/images/card5.webp"
const textureCard = "/images/card6.webp"

export function SpecialCard() {
  return (
    <section className="overflow-hidden relative my-14 w-full" id="features">
      <div className="p-2">
        <div className="pt-4 mx-auto mb-8 md:container">
          <div className="mx-auto">
            <div className="flex justify-center items-center w-full">
              <Badge
                variant="outline"
                className="mb-8 rounded-[14px] border border-black/10 bg-white text-base dark:border dark:border-white/10 dark:bg-transparent md:left-6"
              >
                <SparklesIcon className="  fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
                Component Preview
              </Badge>
            </div>

            <div className=" mx-auto max-w-4xl rounded-[34px] bg-neutral-700">
              <div className="relative z-10 grid w-full gap-8 rounded-[28px] bg-neutral-950 p-2">
                <SkiperCard
                  step1img1Class={cn(
                    "pointer-events-none w-[50%] border border-stone-100/10 transition-all duration-500 dark:border-stone-700/50",
                    "left-1/4 top-[57%] rounded-[24px] max-md:scale-[160%] max-md:rounded-[24px] md:left-[35px] md:top-[29%]",
                    "md:group-hover:translate-y-2"
                  )}
                  step1img2Class={cn(
                    "pointer-events-none w-3/5 overflow-hidden border border-stone-100/10 transition-all duration-500 dark:border-stone-700/50",
                    "left-[69%] top-[53%] rounded-2xl max-md:scale-[160%] max-md:rounded-[24px] md:left-[calc(50%+35px+1rem)] md:top-[21%]",
                    "md:group-hover:-translate-y-6 "
                  )}
                  step2img1Class={cn(
                    "pointer-events-none w-[50%] overflow-hidden rounded-t-[24px] border border-stone-100/10 transition-all duration-500 dark:border-stone-700",
                    "left-1/4 top-[69%] max-md:scale-[160%] md:left-[35px] md:top-[30%]",
                    "md:group-hover:translate-y-2"
                  )}
                  step2img2Class={cn(
                    "pointer-events-none w-2/5 overflow-hidden rounded-2xl rounded-t-[24px] border border-stone-100/10 transition-all duration-500 group-hover:-translate-y-6 dark:border-stone-700",
                    "left-[70%] top-[53%] max-md:scale-[140%] md:left-[calc(50%+27px+1rem)] md:top-1/4",
                    "md:group-hover:-translate-y-6"
                  )}
                  step3imgClass={cn(
                    "pointer-events-none w-[90%] overflow-hidden rounded-t-[24px] border border-stone-100/10 transition-all duration-500 dark:border-stone-700",
                    "left-[5%] top-[50%] md:left-1/2 md:left-[68px] md:top-[30%]"
                  )}

                  description="Make your app 🤌"
                  bgClass="lg:bg-gradient-to-tr"
                  image={{
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step1light1: family as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step1light2: shiftCard as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step2light1: carousel as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step2light2: textureFull as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step3light: textureCard as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step4light: skiper as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step1dark1: family as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step1dark2: shiftCard as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step2dark1: carousel as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step2dark2: textureFull as any,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     step3dark: textureCard as any,
                     alt: "Something",
                   }}
                  title="Components that pop"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
