import Link from "next/link";
import { useRouter } from "next/router";
import { Home, CreditCard, Users, CalendarCheck, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Home", Icon: Home },
  { href: "/admin/subscriptions", label: "Subscriptions", Icon: CreditCard },
  { href: "/admin/users", label: "Users", Icon: Users },
  { href: "/admin/bookings", label: "Bookings", Icon: ClipboardList },
  { href: "/admin/appointments", label: "Appointments", Icon: CalendarCheck },
  { href: "/admin/allAdmins", label: "Admins", Icon: Users },
];

export default function AdminNav() {
  const router = useRouter();
  const pathname = router.asPath;
  return (
    <div className="sticky top-0 z-30 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center gap-2">
          <div className="text-lg font-semibold">Admin</div>
          <nav className="ml-auto flex items-center gap-1">
            {navItems.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <motion.div key={href} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      active ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}


