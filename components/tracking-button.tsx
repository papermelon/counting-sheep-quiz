"use client"

import { Button } from "@/components/ui/button"
import { trackButtonClick } from "@/lib/analytics"
import Link from "next/link"
import { ReactNode } from "react"

interface TrackingButtonProps {
  children: ReactNode
  href: string
  buttonName: string
  location: string
  className?: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}

export function TrackingButton({ 
  children, 
  href, 
  buttonName, 
  location, 
  className,
  variant = "default",
  size = "default"
}: TrackingButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
      onClick={() => trackButtonClick(buttonName, location)}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}
