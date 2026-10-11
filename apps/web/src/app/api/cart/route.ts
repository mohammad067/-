import { NextResponse } from "next/server";
import { CommerceApiError, syncGuestCart } from "@/lib/server/commerce-api";

interface CartInputItem {
  variantId?: unknown;
  quantity?: unknown;
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { items?: unknown };

    if (!Array.isArray(body.items) || body.items.length > 50) {
      return NextResponse.json({ message: "سبد خرید معتبر نیست." }, { status: 422 });
    }

    const items = (body.items as CartInputItem[]).map((item) => ({
      variantId: typeof item.variantId === "string" ? item.variantId : "",
      quantity: typeof item.quantity === "number" ? item.quantity : 0,
    }));

    if (items.some((item) => !/^[0-9A-HJKMNP-TV-Z]{26}$/.test(item.variantId)
      || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) {
      return NextResponse.json({ message: "اقلام سبد خرید معتبر نیستند." }, { status: 422 });
    }

    const result = await syncGuestCart(items);

    return NextResponse.json({ data: result?.cart ?? null });
  } catch (error) {
    const status = error instanceof CommerceApiError ? error.status : 502;
    return NextResponse.json(
      { message: "همگام‌سازی سبد خرید با سرور انجام نشد." },
      { status },
    );
  }
}
