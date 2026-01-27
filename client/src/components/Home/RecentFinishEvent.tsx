import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, CheckCircle, Star, Trophy, Users } from "lucide-react";
import { finishedEvents } from "@/constant/FinishedEvent";

const RecentFinishEvent = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <Trophy className="w-6 h-6 text-orange-500" />
            <h2 className="text-3xl font-bold">Recently Finished Events</h2>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {finishedEvents.map((event, i) => (
              <Card 
                key={event.id}
                className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-0 right-0 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
                  {event.image}
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{event.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-orange-500 transition-colors duration-300">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.participants} participants</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-orange-500/30 text-orange-500 text-xs">
                      {event.category}
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-500 text-xs">
                      {event.department}
                    </Badge>
                  </div>

                  {event.winner !== 'N/A' && (
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold">Winner: {event.winner}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default RecentFinishEvent