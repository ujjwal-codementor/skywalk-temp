import { GetServerSideProps } from "next";
import { checkAdmin } from "@/lib/checkAdmin";
import AdminNav from "@/components/admin/AdminNav";
import { useEffect, useMemo, useState } from "react";
import { useGetApi, usePostApi } from "@/lib/apiCallerClient";
import Modal from "@/components/ui/Modal";
import { format } from "date-fns";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const isAdmin = await checkAdmin(ctx.req as any);
  if (!isAdmin) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
};

interface BookingRow {
  id: string;
  calcomId: string;
  completed: boolean;
  createdAt: string;
  user: { id: string; email: string; fullName: string };
}

export default function AdminBookingsPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const getApi = useGetApi();
  const postApi = usePostApi();

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  async function search() {
    if (!canSearch) return;
    setLoading(true);
    try {
      const res = await getApi(`${BACKEND_URL}/api/admin/bookings/search?q=${encodeURIComponent(query.trim())}`);
      setBookings(res.data.data || []);
    } finally {
      setLoading(false);
    }
  }

  async function markCompleted(bookingId: string) {
    setLoading(true);
    try {
      await postApi(`${BACKEND_URL}/api/admin/bookings/${bookingId}/complete`, {});
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, completed: true } : b)));
    } finally {
      setLoading(false);
    }
  }

  function openConfirm(bookingId: string) {
    setPendingBookingId(bookingId);
    setConfirmOpen(true);
  }

  async function confirmComplete() {
    if (!pendingBookingId) return;
    await markCompleted(pendingBookingId);
    setConfirmOpen(false);
    setPendingBookingId(null);
  }

  useEffect(() => {
    // no auto search
  }, []);

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-gray-600">Search by user email or booking ID, and mark as completed.</p>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter user email or booking id"
            className="input-field flex-1"
          />
          <button onClick={search} disabled={!canSearch || loading} className="btn-primary">{loading ? "Searching..." : "Search"}</button>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Results</h3>
            <span className="text-sm text-gray-500">{bookings.length} found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-2 py-2">Booking ID</th>
                  <th className="px-2 py-2">User</th>
                  <th className="px-2 py-2">Created</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="px-2 py-2 font-mono">{b.id.substring(0, 12)}...</td>
                    <td className="px-2 py-2">{b.user.fullName} <span className="text-gray-500">({b.user.email})</span></td>
                    <td className="px-2 py-2">{format(new Date(b.createdAt), 'PP p')}</td>
                    <td className="px-2 py-2">
                      {b.completed ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Completed</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-right">
                      {!b.completed && (
                        <button onClick={() => openConfirm(b.id)} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td className="px-2 py-4 text-center text-gray-500" colSpan={5}>No bookings</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Mark booking as completed"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Are you sure you want to mark this booking as completed? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <button
              className="btn-secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={confirmComplete}
              disabled={loading}
            >
              {loading ? "Marking..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


