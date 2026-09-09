export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="text-right">
      {children}
    </div>
  );
}
