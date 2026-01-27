import { Button } from '@/components/ui/button'
import { Calendar, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const HeroSection = () => {
  return (
    <section className="pt-24 pb-36 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
      <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300 hover:scale-105 px-4 py-2">
        <Sparkles className="w-4 h-4 mr-2 inline animate-pulse" />
        Discover Campus Events
      </Badge>
      
      <h1 className="text-xl md:text-4xl lg:text-5xl font-bold leading-tight">
        <span className="inline-block hover:scale-105 transition-transform duration-300">
          Never Miss Out on
        </span>
        <br />
        <span className="bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform duration-300">
          Amazing Campus Events
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Explore workshops, fests, seminars, and competitions. Register instantly and stay updated with real-time notifications.
      </p>
      
      <Button className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 group mt-4">
        Explore Events
        <Calendar className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
      </Button>
    </div>
  </section>
  )
}

export default HeroSection