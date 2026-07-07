import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md w-full border-border/60 shadow-lg text-center">
        <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-foreground">404</h1>
          <h2 className="text-xl font-semibold mb-4 text-foreground/80">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The civic page you are looking for doesn't exist or has been moved to a different department.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" /> Return to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}