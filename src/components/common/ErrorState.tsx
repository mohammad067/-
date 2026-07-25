import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "خطایی رخ داده است",
  description = "در برقراری ارتباط با شالیزار مرکزی خطایی به وجود آمد. لطفاً اتصال اینترنت خود را چک کرده و دوباره تلاش کنید.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center rounded-3xl border border-red-500/10 bg-red-500/5 dark:bg-red-500/2 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 stroke-1" />
      </div>
      <Typography variant="h3" className="mb-2 text-primary font-medium">
        {title}
      </Typography>
      <Typography variant="body-sm" className="max-w-md text-muted-foreground mb-6">
        {description}
      </Typography>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-primary/20 hover:border-primary">
          تلاش مجدد
        </Button>
      )}
    </div>
  );
};

ErrorState.displayName = "ErrorState";
