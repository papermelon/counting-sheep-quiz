import Link from "next/link"

export function FooterLogo() {
  return (
    <Link href="/" className="hover:opacity-80 transition-opacity">
      {/* Desktop: Full logo with text */}
      <div className="hidden md:block">
        <img 
          src="/images/primary-logo.png" 
          alt="The Counting Sheep Project" 
          className="h-16 w-auto" 
        />
      </div>
      
      {/* Mobile: Just the sheep logo */}
      <div className="md:hidden">
        <img 
          src="/images/logomark.png" 
          alt="Counting Sheep Logomark" 
          className="h-8 w-auto" 
        />
      </div>
    </Link>
  )
}
