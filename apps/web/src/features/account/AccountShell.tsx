import Link from "next/link";

export function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-[220px_1fr]" dir="rtl">
      <aside className="h-fit rounded-2xl border bg-white p-4">
        <h2 className="mb-4 font-bold">حساب کاربری</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <Link className="rounded-lg px-3 py-2 hover:bg-[#F3EEE4]" href="/account/profile">پروفایل</Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-[#F3EEE4]" href="/account/addresses">آدرس‌ها</Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-[#F3EEE4]" href="/account/orders">سفارش‌ها</Link>
        </nav>
      </aside>
      <section className="min-w-0 rounded-3xl border bg-white p-5 md:p-8">{children}</section>
    </div>
  );
}
