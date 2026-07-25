import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "موردی یافت نشد",
  description = "متاسفانه هیچ محصولی با فیلترها یا عبارت جستجوی فعلی مطابقت ندارد. لطفاً فیلترها را تغییر داده یا مجدداً تلاش کنید.",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 text-center rounded-3xl border border-dashed border-border/60 bg-white/20 dark:bg-black/5 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
        <Search className="w-8 h-8 stroke-1" />
      </div>
      <Typography variant="h3" className="mb-2 font-medium">
        {title}
      </Typography>
      <Typography variant="body-sm" className="max-w-md text-muted-foreground mb-6">
        {description}
      </Typography>
      {action && <div className="animate-slide-up">{action}</div>}
    </div>
  );
};

EmptyState.displayName = "EmptyState";
