import { GetServerSideProps } from "next";
import { db } from "@/lib/db";
import UserSidebar from "@/components/admin/UserSidebar";
import UserDetails from "@/components/admin/UserDetails";
import PaymentHistory from "@/components/admin/PaymentHistory";
import BookingHistory from "@/components/admin/BookingHistory";
import UserSubscriptions from "@/components/admin/UserSubscriptions";
import { useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  user: any | null;
  payments: any[];
  bookings: any[];
  subscriptions: any[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = ctx.params?.email as string;
  const user = await db.user.findFirst({ where: { email } });
  if (!user)
    return { props: { user: null, payments: [], bookings: [], subscriptions: [] } };
  const [payments, bookings, subscriptions] = await Promise.all([
    db.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    db.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    db.subscription.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
  ]);
  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      payments: JSON.parse(JSON.stringify(payments)),
      bookings: JSON.parse(JSON.stringify(bookings)),
      subscriptions: JSON.parse(JSON.stringify(subscriptions)),
    },
  };
};

export default function AdminUserDetailPage(props: Props) {
  const [selected, setSelected] = useState("general");
  if (!props.user)
    return (
      <div>
        <AdminNav />
        <div className="mx-auto max-w-6xl p-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>User not found</CardTitle>
              <CardDescription>Please check the email address and try again.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl p-6 flex gap-6">
        <UserSidebar selected={selected} onSelect={setSelected} />
        <main className="flex-1 space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">{props.user.fullName || "User"}</CardTitle>
                <CardDescription>{props.user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Payments</div>
                    <div className="font-semibold">{props.payments.length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Bookings</div>
                    <div className="font-semibold">{props.bookings.length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Subscriptions</div>
                    <div className="font-semibold">{props.subscriptions.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {selected === "general" && <UserDetails user={props.user} />}
          {selected === "payments" && <PaymentHistory payments={props.payments} />}
          {selected === "bookings" && <BookingHistory bookings={props.bookings} />}
          {selected === "subscriptions" && (
            <UserSubscriptions subscriptions={props.subscriptions} />
          )}
        </main>
      </div>
    </div>
  );
}


