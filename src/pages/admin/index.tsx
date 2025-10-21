import { GetServerSideProps } from "next";
import { checkAdmin, checkSuperAdmin } from "@/lib/checkAdmin";
import AdminNav from "@/components/admin/AdminNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const isAdmin = await checkAdmin(ctx.req as any);
  if (!isAdmin) {
    return { redirect: { destination: "/", permanent: false } };
  }
  const isSuper = await checkSuperAdmin(ctx.req as any);
  return { props: { isSuperAdmin: isSuper } };
};

export default function AdminHome({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const tiles = [
    { href: "/admin/subscriptions", title: "Subscriptions", desc: "Manage and view all subscriptions" },
    { href: "/admin/users", title: "Users", desc: "Search and view users" },
    { href: "/admin/appointments", title: "Appointments", desc: "View booking appointments" },
  ];

  if (isSuperAdmin) {
    tiles.push({ href: "/admin/allAdmins", title: "Admins", desc: "Manage admin users (super admin only)" });
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome, Admin</h1>
          <p className="text-gray-600">Choose a section to get started.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {tiles.map((t) => (
            <motion.div key={t.href} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 200 }}>
              <Link href={t.href}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


