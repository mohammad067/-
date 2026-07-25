# Authentication & Security Protocol

This document defines the authentication flows, authorization rules, and session persistence protocol designed for the premium Rice Shop storefront.

## 1. Security Architecture Goals
- Complete safety of user profile records, past orders, and custom addresses.
- Light-weight cookie-based authentication context with absolute zero impact on initial static page loading times.
- Compliance with secure session patterns (no localStorage for sensitive tokens).

## 2. Session Token Storage & JWT Rules
- **Method**: Standard JSON Web Tokens (JWT) issued by the identity authority.
- **Storage**: Highly secure, `HttpOnly`, `Secure`, and `SameSite=Strict` cookies. This ensures that client-side script modules cannot access the session token, protecting users from Cross-Site Scripting (XSS) attacks.
- **CSRF Protection**: Traditional anti-CSRF headers accompanying dynamic mutation actions (POST/PATCH/DELETE).

## 3. Middleware-Based Routing & Route Guards
We utilize Next.js Middleware (`src/middleware.ts`) to validate the existence and integrity of session tokens before serving private paths (like `/dashboard`, `/cart/checkout`, or `/admin/*`).

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
```

## 4. Federated Identity Options
The storefront will eventually support:
1. **One-Time Password (OTP)**: Traditional Iranian SMS verification (preferred by local customers).
2. **Social Credentials**: Google/Federated standard OAuth interfaces.
