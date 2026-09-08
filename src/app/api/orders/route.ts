import { NextResponse } from "next/server";

const orders: Record<string, unknown>[] = [];

export async function POST(request: Request) {
  const body = await request.json();
  const orderId = `TS-${Date.now().toString().slice(-8)}`;
  const order = { orderId, ...body, createdAt: new Date().toISOString() };
  orders.unshift(order);
  return NextResponse.json({ ok: true, orderId });
}
