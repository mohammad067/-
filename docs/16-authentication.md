# Authentication Strategy

This document describes the design and strategy for user authentication and authorization within the Premium Rice Shop application.

## 1. Authentication Core
For premium B2C and B2B workflows, the application supports secure session-based authentication using **NextAuth.js** or standard **JWT token-based auth** with HttpOnly cookies.

### 1.1 Support for Identity Providers
- **OTP (One-Time Password) via SMS**: The primary authentication vector for Iranian customers, allowing frictionless mobile-number login.
- **OAuth Social Login**: Google and Yahoo OAuth options for swift access.
- **Credentials-based Auth**: Traditional username/password scheme with multi-factor backup.

## 2. Session Management
- **Token Storage**: All credentials and session identifiers are persisted in secure, encrypted, `HttpOnly`, `SameSite=Strict` cookies to block cross-site scripting (XSS) and cross-site request forgery (CSRF) vectors.
- **Next.js Middleware Protection**:
  Protected routes (e.g., `/orders`, `/profile`, and administrative consoles under `/admin`) are intercepted at the Edge layer via `middleware.ts`:

  ```typescript
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';

  export function middleware(request: NextRequest) {
    const token = request.cookies.get('session-token');

    if (request.nextUrl.pathname.startsWith('/admin') && !token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }
  ```

## 3. Role-Based Access Control (RBAC)
User tiers are configured as:
- **GUEST**: Permission to browse products, read reviews, and add to cart.
- **CUSTOMER**: Access to profile management, personal order history, and checkout pipelines.
- **ADMIN**: Access to inventory lists, sales graphs, order fulfillment panels, and pricing adjustment controls.
