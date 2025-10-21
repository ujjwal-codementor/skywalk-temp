import UserSearch from "@/components/admin/UserSearch";
import AdminNav from "@/components/admin/AdminNav";
import { GetServerSideProps } from "next";
import { checkAdmin } from "@/lib/checkAdmin";
import { motion } from "framer-motion";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const isAdmin = await checkAdmin(ctx.req as any);
  if (!isAdmin) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
};

export default function AdminUsersPage() {
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl p-6 space-y-6">
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">Users</motion.h1>
      <UserSearch />
      </div>
    </div>
  );
}


