import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, CheckCircle } from "lucide-react";

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
        {isLoading && <p className="text-muted-foreground flex items-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>Generating suggestion...</p>}
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
