import { Bell, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function NotificationBanner() {
  const [showNotification, setShowNotification] = useState(true);
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-top duration-500">
          <Card className="border-orange-500/30 bg-background/95 backdrop-blur-xl shadow-lg">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-orange-500 animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Registration Confirmed!</p>
                  <p className="text-xs text-muted-foreground">You're registered for "AI Workshop" on Dec 25</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowNotification(false)}
                className="hover:bg-orange-500/10 transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
  )
}
