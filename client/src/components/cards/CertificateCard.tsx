import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CertificateCard() {
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <p className="font-medium">Hackathon 2025</p>
        <p className="text-sm text-muted-foreground">
          Position: 1st
        </p>
        <Button size="sm">Download</Button>
      </CardContent>
    </Card>
  );
}
