"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">GiveMeThatJob</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        <button 
          className="block md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 flex flex-col gap-4">
          <Link 
            href="#features" 
            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="#pricing" 
            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            href="#testimonials" 
            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Testimonials
          </Link>
          <div className="border-t my-2"></div>
          <div className="flex flex-col gap-2 px-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="w-full">Get Started</Button>
            </Link>
            <div className="flex justify-start py-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}