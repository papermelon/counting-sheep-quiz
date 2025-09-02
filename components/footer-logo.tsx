import Link from "next/link"

export function FooterLogo() {
  return (
    <Link href="/" className="hover:opacity-80 transition-opacity">
      <img 
        src="/images/logomark.png" 
        alt="Counting Sheep Logomark" 
        className="h-8 md:h-10 w-auto" 
      />
    </Link>
  )
}
