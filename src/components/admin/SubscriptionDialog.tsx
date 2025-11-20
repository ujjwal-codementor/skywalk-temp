
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Link from "next/link";

interface Props {
  subscriptionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionDialog({ subscriptionId, isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || !subscriptionId) return;
    setLoading(true);
    fetch(`/api/admin/subscriptions/${subscriptionId}`)
      .then((r) => r.json())
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [isOpen, subscriptionId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subscription Details" size="xl">
      {loading && <div>Loading...</div>}
      {!loading && data && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">ID</div>
              <div className="font-medium break-all">{data.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">User Email</div>
              <div className="font-medium">{data.user?.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Plan</div>
              <div className="font-medium">{data.planType || data.subscriptionType}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-medium">{data.status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Created</div>
              <div className="font-medium">{new Date(data.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Payments</div>
            <div className="mt-2 rounded border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Invoice</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.payments || []).map((p: any) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-2">{p.invoiceId}</td>
                      <td className="p-2">{p.status ?? (p.isCancelPayment ? "cancel" : "paid")}</td>
                      <td className="p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-2">
                        {p.invoiceLink && (
                          <a href={p.invoiceLink} target="_blank" rel="noreferrer" className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 inline-block">Invoice</a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data.user?.email && (
            <div>
              <Link href={`/admin/users/${encodeURIComponent(data.user.email)}`} className="text-blue-600 hover:underline">
                Go to User Page →
              </Link>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}



