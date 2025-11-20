import { useEffect, useState } from "react";
import SubscriptionDialog from "@/components/admin/SubscriptionDialog"; 
import { GetServerSideProps } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Optional: you can protect server-side, but page will also fetch client-side
  return { props: {} };
};

export default function AdminSubscriptionsPage() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [sortMode, setSortMode] = useState<"default" | "activeFirst">("default");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/subscriptions")
      .then((r) => r.json())
      .then((res) => setRows(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const displayedRows = (() => {
    const list = [...rows];
    if (sortMode === "activeFirst") {
      list.sort((a, b) => {
        const aActive = a.status === "active";
        const bActive = b.status === "active";
        if (aActive === bActive) return 0;
        return aActive ? -1 : 1;
      });
    }
    return list;
  })();

  const refresh = () => {
    setLoading(true);
    fetch("/api/admin/subscriptions")
      .then((r) => r.json())
      .then((res) => setRows(res.data || []))
      .finally(() => setLoading(false));
  };

  const confirmCancel = async (mode: "withFee" | "noFee") => {
    if (!pendingCancelId) return;
    try {
      setConfirmLoading(true);
      await fetch(`/api/admin/subscriptions/${pendingCancelId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", mode }),
      });
      refresh();
      setConfirmOpen(false);
      setPendingCancelId(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">Subscriptions</motion.h1>
        <div className="rounded-lg border bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Subscriptions</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort</label>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as any)}
              className="h-9 rounded-md border border-gray-300 px-2 text-sm"
            >
              <option value="default">Default</option>
              <option value="activeFirst">Active first</option>
            </select>
          </div>
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
                <th className="p-3">Actions</th>
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
              {displayedRows.map((s) => (
                <motion.tr key={s.id} className="border-t" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                  <td className="p-3 font-mono text-xs break-all">{s.id}</td>
                  <td className="p-3">{s.user?.email}</td>
                  <td className="p-3">{s.subscriptionType}</td>
                  <td className="p-3">{s.status}</td>
                  <td className="p-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => { setSelectedId(s.id); setOpen(true); }}
                      className="px-3 py-1 rounded bg-gray-900 text-white hover:bg-black"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => { setPendingCancelId(s.id); setConfirmOpen(true); }}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                      disabled={s.status !== "active"}
                    >
                      Cancel
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        <SubscriptionDialog subscriptionId={selectedId} isOpen={open} onClose={() => setOpen(false)} />
        <Modal isOpen={confirmOpen} onClose={() => { if (!confirmLoading) setConfirmOpen(false); }} title="Cancel subscription" size="sm">
          <div className="space-y-4">
            <p>Choose how you want to cancel this subscription.</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setConfirmOpen(false)}
                disabled={confirmLoading}
              >
                Close
              </button>
              <button
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={() => confirmCancel("withFee")}
                disabled={confirmLoading}
              >
                {confirmLoading ? "Cancelling..." : "Cancel with fee"}
              </button>
              <button
                className="px-3 py-2 rounded bg-gray-900 text-white hover:bg-black disabled:opacity-50"
                onClick={() => confirmCancel("noFee")}
                disabled={confirmLoading}
              >
                {confirmLoading ? "Cancelling..." : "Cancel without fee"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}


