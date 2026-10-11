import { NextResponse } from "next/server";
import {
  CommerceApiError,
  placeGuestOrder,
  readGuestOrder,
  completeCheckout,
  syncGuestCart,
} from "@/lib/server/commerce-api";

interface CheckoutBody {
  checkoutKey?: unknown;
  fullName?: unknown;
  mobile?: unknown;
  email?: unknown;
  province?: unknown;
  city?: unknown;
  postalCode?: unknown;
  address?: unknown;
  delivery?: unknown;
  items?: unknown;
}

function apiMessage(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null || !("message" in payload)) return null;
  return typeof payload.message === "string" ? payload.message : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const items = Array.isArray(body.items)
      ? body.items.map((item: { variantId?: unknown; quantity?: unknown }) => ({
          variantId: typeof item.variantId === "string" ? item.variantId : "",
          quantity: typeof item.quantity === "number" ? item.quantity : 0,
        }))
      : [];

    if (items.length === 0 || items.length > 50
      || items.some((item) => !/^[0-9A-HJKMNP-TV-Z]{26}$/.test(item.variantId)
        || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) {
      return NextResponse.json({ message: "سبد خرید معتبر نیست." }, { status: 422 });
    }

    if (typeof body.checkoutKey !== "string" || body.checkoutKey.length < 32
      || typeof body.fullName !== "string" || typeof body.mobile !== "string"
      || typeof body.province !== "string" || typeof body.city !== "string"
      || typeof body.address !== "string" || typeof body.delivery !== "string") {
      return NextResponse.json({ message: "اطلاعات سفارش کامل نیست." }, { status: 422 });
    }

    const synced = await syncGuestCart(items);

    if (synced === null) {
      return NextResponse.json({ message: "سبد خرید خالی است." }, { status: 409 });
    }

    const response = await placeGuestOrder({
      cart: synced.cart,
      cartToken: synced.token,
      idempotencyKey: body.checkoutKey,
      customer: {
        name: body.fullName.trim(),
        phone: body.mobile,
        ...(typeof body.email === "string" && body.email.trim() ? { email: body.email.trim() } : {}),
      },
      shippingAddress: {
        province: body.province.trim(),
        city: body.city.trim(),
        addressLine: body.address.trim(),
        ...(typeof body.postalCode === "string" && body.postalCode.trim()
          ? { postalCode: body.postalCode.trim() }
          : {}),
      },
      shippingMethod: body.delivery,
    });
    await completeCheckout();

    return NextResponse.json({ data: response.data }, { status: 201 });
  } catch (error) {
    if (error instanceof CommerceApiError) {
      return NextResponse.json(
        { message: apiMessage(error.payload) ?? "ثبت سفارش انجام نشد.", details: error.payload },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "سرویس سفارش در دسترس نیست. دوباره تلاش کنید." },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderNumber = url.searchParams.get("orderNumber")?.trim().toUpperCase() ?? "";
  const mobile = url.searchParams.get("mobile")?.replace(/\D/g, "") ?? "";

  if (!/^TS-[A-Z0-9-]+$/.test(orderNumber) || !/^09\d{9}$/.test(mobile)) {
    return NextResponse.json({ message: "شماره سفارش یا موبایل معتبر نیست." }, { status: 422 });
  }

  try {
    const order = await readGuestOrder(orderNumber, mobile);

    if (order === null) {
      return NextResponse.json({ message: "سفارشی با این اطلاعات در این مرورگر پیدا نشد." }, { status: 404 });
    }

    return NextResponse.json({ data: order });
  } catch (error) {
    const status = error instanceof CommerceApiError && error.status === 404 ? 404 : 502;
    return NextResponse.json(
      { message: status === 404 ? "سفارش پیدا نشد." : "سرویس پیگیری در دسترس نیست." },
      { status },
    );
  }
}
