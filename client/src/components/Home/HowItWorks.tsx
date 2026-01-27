import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { howItWorksSteps } from "@/constant/HowItWorks";


export function HowItWorks() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in just 4 simple steps and never miss an event again
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Card 
                  key={i}
                  className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer relative overflow-hidden"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${step.color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${step.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-lg font-bold">
                        {i + 1}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-orange-500 transition-colors duration-300">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 group">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
  )
}
