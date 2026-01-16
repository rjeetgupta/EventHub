import Link from "next/link"
import { Github, Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              EventHub
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The official hub for campus life. Discover, organize, and manage 
              events across all departments in one place.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors"><Instagram size={18} /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Twitter size={18} /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Github size={18} /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Mail size={18} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Events</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/events" className="hover:text-foreground transition-colors">All Events</Link></li>
              <li><Link href="/events?cat=tech" className="hover:text-foreground transition-colors">Technical Fest</Link></li>
              <li><Link href="/events?cat=cultural" className="hover:text-foreground transition-colors">Cultural Nights</Link></li>
              <li><Link href="/events?cat=sports" className="hover:text-foreground transition-colors">Sports Meet</Link></li>
            </ul>
          </div>

          {/* Department Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Departments</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Computer Science</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Mechanical Eng.</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Arts & Design</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Business School</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/guidelines" className="hover:text-foreground transition-colors">Event Guidelines</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center md:flex md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EventHub. Managed by University Student Council.
          </p>
          <p className="mt-4 text-xs text-muted-foreground md:mt-0">
            Built with Next.js & Shadcn UI.
          </p>
        </div>
      </div>
    </footer>
  )
}
