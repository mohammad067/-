import "server-only";

import { cookies } from "next/headers";

const CART_ID_COOKIE = "ts_cart_id";
const CART_TOKEN_COOKIE = "ts_cart_token";
const AUTH_TOKEN_COOKIE = "ts_auth_token";

interface ApiEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiCartItem {
  variantId: string;
  quantity: number;
}

export interface ApiCart {
  id: string;
  status: string;
  items: ApiCartItem[];
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totals: {
    subtotalRials: number;
    shippingRials: number;
    totalRials: number;
  };
  customer: { phone: string; email: string | null };
  shippingMethod: { code: string; name: string };
  shippingAddress: {
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    postalCode: string | null;
    addressLine: string;
  };
  placedAt: string;
}

export interface ApiUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  phoneVerified: boolean;
}

export class CommerceApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: unknown,
  ) {
    super("Commerce API request failed");
  }
}

function apiUrl(path: string): string {
  const baseUrl = (process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");
  return `${baseUrl}/${path.replace(/^\//, "")}`;
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<ApiEnvelope<T>> {
  const response = await fetch(apiUrl(path), {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new CommerceApiError(response.status, payload);
  }

  return payload as ApiEnvelope<T>;
}

async function createGuestCart(): Promise<{ cart: ApiCart; token: string }> {
  const response = await apiRequest<ApiCart>("carts", { method: "POST" });
  const token = response.meta?.cartToken;

  if (typeof token !== "string") {
    throw new Error("The commerce API did not return a cart token.");
  }

  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
  cookieStore.set(CART_ID_COOKIE, response.data.id, options);
  cookieStore.set(CART_TOKEN_COOKIE, token, options);

  return { cart: response.data, token };
}

async function resolveGuestCart(): Promise<{ cart: ApiCart; token: string } | null> {
  const cookieStore = await cookies();
  const id = cookieStore.get(CART_ID_COOKIE)?.value;
  const token = cookieStore.get(CART_TOKEN_COOKIE)?.value;

  if (!id || !token) {
    return null;
  }

  try {
    const response = await apiRequest<ApiCart>(`carts/${id}`, {
      headers: { "X-Cart-Token": token },
    });

    if (response.data.status !== "active" && response.data.status !== "abandoned") {
      return null;
    }

    return { cart: response.data, token };
  } catch (error) {
    if (error instanceof CommerceApiError && (error.status === 404 || error.status === 409)) {
      return null;
    }

    throw error;
  }
}

export async function syncGuestCart(items: ApiCartItem[]): Promise<{ cart: ApiCart; token: string } | null> {
  let resolved = await resolveGuestCart();

  if (resolved === null && items.length === 0) {
    return null;
  }

  resolved ??= await createGuestCart();
  const desiredVariants = new Set(items.map((item) => item.variantId));

  for (const existingItem of resolved.cart.items) {
    if (!desiredVariants.has(existingItem.variantId)) {
      const response = await apiRequest<ApiCart>(
        `carts/${resolved.cart.id}/items/${existingItem.variantId}`,
        { method: "DELETE", headers: { "X-Cart-Token": resolved.token } },
      );
      resolved.cart = response.data;
    }
  }

  for (const item of items) {
    const response = await apiRequest<ApiCart>(
      `carts/${resolved.cart.id}/items/${item.variantId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Cart-Token": resolved.token,
        },
        body: JSON.stringify({ quantity: item.quantity }),
      },
    );
    resolved.cart = response.data;
  }

  return resolved;
}

export async function placeGuestOrder(input: {
  cart: ApiCart;
  cartToken: string;
  idempotencyKey: string;
  customer: { name: string; phone: string; email?: string };
  shippingAddress: { province: string; city: string; postalCode?: string; addressLine: string };
  shippingMethod: string;
}): Promise<ApiEnvelope<ApiOrder>> {
  const token = (await cookies()).get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    throw new CommerceApiError(401, { message: "برای ثبت سفارش وارد حساب کاربری شوید." });
  }

  return apiRequest<ApiOrder>("orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Cart-Token": input.cartToken,
      "X-Idempotency-Key": input.idempotencyKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      cartId: input.cart.id,
      customer: input.customer,
      shippingAddress: input.shippingAddress,
      shippingMethod: input.shippingMethod,
    }),
  });
}

export async function completeCheckout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_ID_COOKIE);
  cookieStore.delete(CART_TOKEN_COOKIE);
}

export async function readGuestOrder(orderNumber: string, mobile: string): Promise<ApiOrder | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) return null;

  const response = await apiRequest<ApiOrder>(`orders/by-number/${encodeURIComponent(orderNumber)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const normalizedPhone = response.data.customer.phone.replace(/^\+98/, "0").replace(/\D/g, "");

  if (response.data.orderNumber.toUpperCase() !== orderNumber.toUpperCase()
    || normalizedPhone !== mobile.replace(/\D/g, "")) {
    return null;
  }

  return response.data;
}

export async function authenticate(
  mode: "login" | "register",
  input: { name?: string; phone: string; password: string; passwordConfirmation?: string },
): Promise<ApiUser> {
  const response = await apiRequest<ApiUser>(`auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      phone: input.phone,
      password: input.password,
      password_confirmation: input.passwordConfirmation,
    }),
  });
  const token = response.meta?.token;

  if (typeof token !== "string") throw new Error("Authentication token is missing.");

  (await cookies()).set(AUTH_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response.data;
}

export async function currentUser(): Promise<ApiUser | null> {
  const token = (await cookies()).get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    return (await apiRequest<ApiUser>("auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })).data;
  } catch (error) {
    if (error instanceof CommerceApiError && error.status === 401) return null;
    throw error;
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  if (token) {
    await apiRequest<never>("auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }

  cookieStore.delete(AUTH_TOKEN_COOKIE);
}

export async function authenticatedRequest<T>(path: string, init: RequestInit = {}): Promise<ApiEnvelope<T>> {
  const token = (await cookies()).get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) throw new CommerceApiError(401, { message: "ابتدا وارد حساب کاربری شوید." });

  return apiRequest<T>(path, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init.headers },
  });
}

export async function publicAuthRequest<T>(path: string, body: unknown): Promise<ApiEnvelope<T>> {
  return apiRequest<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
