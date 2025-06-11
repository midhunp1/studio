
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, CheckCircle, Sandwich } from "lucide-react";

interface AISuggestionCardProps {
  title: string;
  suggestion?: string;
  reasoning?: string;
  isLoading: boolean;
  error?: string | null;
}

export function AISuggestionCard({ title, suggestion, reasoning, isLoading, error }: AISuggestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-accent" />
          {title}
        </CardTitle>
        <CardDescription>AI-powered insight for your business.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground flex items-center"><Sandwich className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" />Generating suggestion...</p>}
        {error && <p className="text-destructive">Error: {error}</p>}
        {!isLoading && !error && suggestion && (
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-primary flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Suggestion:
              </h4>
              <p className="text-foreground ml-7">{suggestion}</p>
            </div>
            {reasoning && (
              <div>
                <h4 className="font-semibold text-primary">Reasoning:</h4>
                <p className="text-muted-foreground text-sm">{reasoning}</p>
              </div>
            )}
          </div>
        )}
        {!isLoading && !error && !suggestion && (
          <p className="text-muted-foreground">Enter details above and click "Generate" to get a suggestion.</p>
        )}
      </CardContent>
    </Card>
  );
}
