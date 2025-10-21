// "use client";
import { useEffect, useState } from "react";
import SubscriptionDialog from "@/components/admin/SubscriptionDialog";

export default function SubscriptionTable() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/subscriptions")
      .then((r) => r.json())
      .then((res) => setRows(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const openDialog = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <div className="rounded-lg border bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Subscriptions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">User Email</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="p-3" colSpan={6}>Loading...</td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td className="p-3" colSpan={6}>No subscriptions found</td>
              </tr>
            )}
            {rows.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-mono text-xs break-all">{s.id}</td>
                <td className="p-3">{s.user?.email}</td>
                <td className="p-3">{s.planType || s.subscriptionType}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => openDialog(s.id)}
                    className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-black"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SubscriptionDialog
        subscriptionId={selectedId}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}



