"use client"

import { TextScroll } from "../ui/text-scroll"

export function TextScrollDemo() {
  return (
    <div className="mb-[8rem]">
      <TextScroll
        className="font-display  text-center text-3xl font-semibold tracking-tighter  text-black dark:text-white md:text-6xl md:leading-[5rem] "
        text="Web Developer | AI Enthusiast | Tech Geek | Freelancer | Open Source Contributor | 3D Artist | Video Editor | Content Creator"
        default_velocity={5}
      />
    </div>
  )
}
