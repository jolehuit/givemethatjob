import Link from "next/link";
import { Briefcase, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            <span className="font-semibold">GiveMeThatJob</span>
          </Link>
          <p className="mt-2 text-center text-xs leading-5 text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} GiveMeThatJob. All rights reserved.
          </p>
          <div className="mt-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-xs text-muted-foreground justify-center md:justify-start">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}