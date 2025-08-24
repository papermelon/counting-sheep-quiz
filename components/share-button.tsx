"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  resultId: string
  size?: "sm" | "default" | "lg"
}

export function ShareButton({ resultId, size = "default" }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/shared/${resultId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Sleep Assessment Results",
          text: "Check out my sleep assessment results from The Counting Sheep Project",
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Share link copied to clipboard!")
      } catch (error) {
        toast.error("Failed to copy share link")
      }
    }
  }

  return (
    <Button onClick={handleShare} size={size} variant="outline">
      <Share2 className="w-4 h-4 mr-1" />
      Share
    </Button>
  )
}
