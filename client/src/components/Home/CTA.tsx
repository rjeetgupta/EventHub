import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-orange-500/20 shadow-2xl shadow-orange-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-amber-500/5 to-orange-600/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <CardContent className="relative p-12 text-center space-y-6">
              <Sparkles className="w-12 h-12 text-orange-500 mx-auto animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Join Amazing Events?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start exploring events, connect with peers, and make the most of your campus life
              </p>
              <Button className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-6 text-lg font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 group mt-4">
                Explore Events Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
  )
}
