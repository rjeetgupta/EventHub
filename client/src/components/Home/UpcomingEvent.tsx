import { ArrowRight, Calendar, Clock, Import, MapPin, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { upcomingEvents } from '@/constant/UpcommingEvent';


const UpcomingEvent = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-3xl font-bold">Upcoming Events</h2>
              <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Live</Badge>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {upcomingEvents.slice(0, 6).map((event, i) => (
              <Card 
                key={event.id}
                className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {event.featured && (
                  <div className="absolute top-0 left-0 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-br-lg">
                    Featured
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={`${event.status === 'Closing Soon' ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                    {event.status}
                  </Badge>
                </div>
                <CardHeader className="pb-3 pt-8">
                  <CardTitle className="text-lg group-hover:text-orange-500 transition-colors duration-300">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.department}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-orange-500/30 text-orange-500 text-xs">
                      {event.category}
                    </Badge>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-500 text-xs">
                      {event.mode}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{event.registrations} registered</span>
                      <span>{event.maxCapacity} capacity</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-orange-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${(event.registrations / event.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold transition-all duration-300 group-hover:scale-105">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              className="border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300 hover:scale-105 group px-8 py-6 text-lg"
            >
              View All Events
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
  )
}

export default UpcomingEvent