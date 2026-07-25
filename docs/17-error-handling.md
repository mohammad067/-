# Error Handling & Resilience Strategy

This document describes how the application guarantees resilience, graceful fallback UI, and standardized API error structures across the storefront.

## 1. Client-Side Error Boundaries
Using React 19 / Next.js 15, we encapsulate route folders inside physical `error.tsx` boundary files. This prevents local component failures from crashing the entire page or layout shell.

### 1.1 Custom Reusable Error State Components
Shared components such as `ErrorState.tsx` provide clear call-to-actions, helpful localized text in Persian, and structural fallback flows:
```typescript
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 border border-red-500/20 bg-red-500/5 rounded-lg text-center">
    <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
    <Typography variant="h4" className="text-red-500 font-bold mb-2">خطا در پردازش اطلاعات</Typography>
    <Typography variant="body-sm" className="text-muted-foreground mb-4">{message}</Typography>
    {onRetry && <Button variant="outline" onClick={onRetry}>تلاش مجدد</Button>}
  </div>
);
```

## 2. API Error Contracts
To align client state with server states, all Backend-for-Frontend (BFF) endpoints return a consistent, predictable JSON schema under error circumstances:

```json
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "موجودی رقم برنج درخواستی به پایان رسیده است.",
    "details": {
      "productId": "prod_123",
      "available": 0
    }
  }
}
```

## 3. Data-Fetching Resilience (TanStack Query)
- **Automatic Retries**: Failed GET queries are configured to retry up to 3 times with an exponential backoff factor to accommodate temporary network instability.
- **Offline Fallback**: Offline/Online state listeners automatically alert the user with a premium glass-toast notification when local network conditions degrade.
