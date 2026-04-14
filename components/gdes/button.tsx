import type { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  variant?: "primary" | "outline"
  type?: "button" | "submit"
  onClick?: () => void
}

export function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "h-14 w-full rounded-lg text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-center gap-3"

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "bg-card border border-input text-primary hover:bg-muted",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}
