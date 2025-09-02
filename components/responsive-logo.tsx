import Link from "next/link"

export function ResponsiveLogo() {
  return (
    <Link href="/" className="hover:opacity-80 transition-opacity">
      {/* Desktop: Full logo with text */}
      <div className="hidden md:block">
        <img 
          src="/images/primary-logo.png" 
          alt="The Counting Sheep Project" 
          className="h-60 w-auto" 
        />
      </div>
      
      {/* Mobile: Just the sheep icon */}
      <div className="md:hidden">
        <div className="flex items-center space-x-3">
          <div className="bg-black rounded-lg p-2 w-12 h-12 flex items-center justify-center">
            <div className="text-white text-2xl">🐑</div>
          </div>
          <span className="text-white font-bold text-lg">
            THE COUNTING SHEEP PROJECT
          </span>
        </div>
      </div>
    </Link>
  )
}
