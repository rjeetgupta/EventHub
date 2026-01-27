import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { faqs } from "@/constant/FAQ";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const FAQ = () => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
    
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <Badge className="bg-orange-accent/10 text-orange-accent border-orange-accent/20 hover:bg-orange-accent/20 transition-all duration-300">
              Got Questions?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about registering for events
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card 
                key={i}
                className="border-orange-accent/20 hover:border-orange-accent/40 transition-all duration-900 cursor-pointer overflow-hidden"
              >
                <CardHeader 
                  className="cursor-pointer hover:bg-orange-accent/5 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{faq.question}</CardTitle>
                    <div className={`w-8 h-8 rounded-full bg-orange-accent/10 flex items-center justify-center transition-transform duration-300 ${expandedFaq === i ? 'rotate-180' : ''}`}>
                      {expandedFaq === i ? (
                        <Minus className="w-4 h-4 text-orange-accent" />
                      ) : (
                        <Plus className="w-4 h-4 text-orange-accent" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedFaq === i && (
                  <CardContent className="animate-in slide-in-from-top-2 duration-300">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default FAQ