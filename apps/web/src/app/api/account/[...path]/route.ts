import { NextResponse } from "next/server";
import { authenticatedRequest, CommerceApiError } from "@/lib/server/commerce-api";

const ALLOWED = [
  /^profile$/,
  /^addresses$/,
  /^addresses\/[0-9A-HJKMNP-TV-Z]{26}$/,
  /^orders$/,
  /^phone-verification\/(request|confirm)$/,
];

async function proxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const path = (await context.params).path.join("/");
  if (!ALLOWED.some((pattern) => pattern.test(path))) {
    return NextResponse.json({ message: "مسیر حساب معتبر نیست." }, { status: 404 });
  }

  try {
    const body = request.method === "GET" || request.method === "DELETE" ? undefined : await request.text();
    const response = await authenticatedRequest<unknown>(`account/${path}`, {
      method: request.method,
      ...(body ? { body, headers: { "Content-Type": "application/json" } } : {}),
    });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof CommerceApiError) {
      return NextResponse.json(error.payload ?? { message: "درخواست انجام نشد." }, { status: error.status });
    }
    return NextResponse.json({ message: "سرویس حساب در دسترس نیست." }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
