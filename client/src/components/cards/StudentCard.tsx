import { Card, CardContent } from "@/components/ui/card";

export default function StudentCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="font-medium">John Doe</p>
        <p className="text-sm text-muted-foreground">
          Computer Science
        </p>
      </CardContent>
    </Card>
  );
}
