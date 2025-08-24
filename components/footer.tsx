import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#221F3C] border-t border-[#B2A4D4]/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <img src="/images/logomark.png" alt="Counting Sheep Logomark" className="w-8 h-8" />
            <p className="text-[#B2A4D4] text-sm">
              © 2025 The Counting Sheep Project. Designing Better Sleep Through Play.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="text-[#B2A4D4] hover:text-[#F7E5C8] text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/admin" className="text-[#B2A4D4] hover:text-[#F7E5C8] text-sm transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
