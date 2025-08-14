import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Home, Info } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  active: string
}

export function Header({ active }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image src="/images/logo.png" alt="Brasil Search" width={32} height={32} className="rounded-lg" />
            <span className="hidden font-bold sm:inline-block text-lg">Brasil Search</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-1 ml-6">
          <Button variant={active === "/" ? "default" : "ghost"} size="sm" asChild className="hidden sm:flex">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button
            variant={active.startsWith("/cep") ? "default" : "ghost"}
            size="sm"
            asChild
            className="hidden sm:flex"
          >
            <Link href="/cep/01001000" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              CEP
            </Link>
          </Button>

          <Button variant={active === "/about" ? "default" : "ghost"} size="sm" asChild className="hidden sm:flex">
            <Link href="/about" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Sobre
            </Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <nav className="flex items-center space-x-1 ml-6 sm:hidden">
          <Button variant={active === "/" ? "default" : "ghost"} size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant={active.startsWith("/cep") ? "default" : "ghost"} size="sm" asChild>
            <Link href="/cep/01001000">
              <MapPin className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant={active === "/about" ? "default" : "ghost"} size="sm" asChild>
            <Link href="/about">
              <Info className="h-4 w-4" />
            </Link>
          </Button>
        </nav>

        {/* Right side - empty now */}
        <div className="flex flex-1 items-center justify-end">{/* Theme toggle removed */}</div>
      </div>
    </header>
  )
}
