// lib/design.ts

export const DESIGN = {
  layout: {
    container: "mx-auto max-w-[1600px] px-6 lg:px-10 xl:px-12",
    section: "py-24",
  },

  radius: {
    card: "rounded-2xl",
    image: "rounded-2xl",
    button: "rounded-full",
    input: "rounded-xl",
  },

  shadow: {
    card: "shadow-[0_20px_60px_rgba(0,0,0,0.05)]",
  },

  transition: {
    default: "transition-all duration-300",
  },
} as const;