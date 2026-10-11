import { NextResponse } from "next/server";
import { authenticate, CommerceApiError, currentUser, logout, publicAuthRequest } from "@/lib/server/commerce-api";

export async function GET() {
  try {
    const user = await currentUser();
    return NextResponse.json({ data: user }, { status: user ? 200 : 401 });
  } catch {
    return NextResponse.json({ message: "سرویس ورود در دسترس نیست." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.mode === "password-request" || body.mode === "password-confirm") {
      const path = body.mode === "password-request" ? "auth/password/request" : "auth/password/confirm";
      const response = await publicAuthRequest<{ message: string }>(path, body);
      return NextResponse.json(response, { status: body.mode === "password-request" ? 202 : 200 });
    }

    const mode = body.mode === "register" ? "register" : "login";
    const user = await authenticate(mode, {
      name: typeof body.name === "string" ? body.name : undefined,
      phone: typeof body.phone === "string" ? body.phone : "",
      password: typeof body.password === "string" ? body.password : "",
      passwordConfirmation: typeof body.passwordConfirmation === "string" ? body.passwordConfirmation : undefined,
    });

    return NextResponse.json({ data: user }, { status: mode === "register" ? 201 : 200 });
  } catch (error) {
    if (error instanceof CommerceApiError) {
      const payload = error.payload as { message?: string; errors?: unknown } | null;
      return NextResponse.json(
        { message: payload?.message ?? "ورود انجام نشد.", errors: payload?.errors },
        { status: error.status },
      );
    }

    return NextResponse.json({ message: "سرویس ورود در دسترس نیست." }, { status: 502 });
  }
}

export async function DELETE() {
  await logout();
  return new NextResponse(null, { status: 204 });
}
