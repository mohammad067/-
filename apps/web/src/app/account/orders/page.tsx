import { AccountShell } from "@/features/account/AccountShell";
import { OrderHistory } from "@/features/account/OrderHistory";

export default function OrdersPage() {
  return <AccountShell><OrderHistory /></AccountShell>;
}
