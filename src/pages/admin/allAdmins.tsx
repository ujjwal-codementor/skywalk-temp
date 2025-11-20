import { GetServerSideProps } from "next";
import { checkSuperAdmin } from "@/lib/checkAdmin";
import AdminNav from "@/components/admin/AdminNav";
import { useEffect, useState } from "react";
import { useGetApi, usePostApi } from "@/lib/apiCallerClient";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const isSuper = await checkSuperAdmin(ctx.req as any);
  if (!isSuper) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
};

interface AdminRec {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AllAdminsPage() {
  const [admins, setAdmins] = useState<AdminRec[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const getApi = useGetApi();
  const postApi = usePostApi();

  async function load() {
    setLoading(true);
    try {
      const res = await getApi(`${BACKEND_URL}/api/admin/admins`);
      setAdmins(res.data.data || []);
    } finally {
      setLoading(false);
    }
  }

  async function addAdmin() {
    if (!name.trim() || !email.trim()) return;
    const normalizedEmail = email.trim().toLowerCase();
    // Client-side duplicate guard (case-insensitive)
    if (admins.some((a) => a.email.toLowerCase() === normalizedEmail)) {
      alert("Admin with this email already exists");
      return;
    }
    setLoading(true);
    try {
      const res = await postApi(`${BACKEND_URL}/api/admin/admins`, { name: name.trim(), email: email.trim() });
      if (!res.data?.success) {
        alert(res.data?.error || "Failed to add admin");
        return;
      }
      setName("");
      setEmail("");
      await load();
    } catch (e: any) {
      const message = e?.response?.data?.error as string | undefined;
      if (message && message.toLowerCase().includes("exists")) {
        alert("Admin with this email already exists");
      } else {
        alert(message || "Failed to add admin");
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteAdmin(id: string) {
    setLoading(true);
    try {
      await postApi(`${BACKEND_URL}/api/admin/admins`, { action: "delete", id });
      await load();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-4xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">All Admins</h1>
          <p className="text-gray-600">Only visible to Super Admin. Add or remove admins below.</p>
        </div>

        <div className="card p-4">
          <div className="grid md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <button onClick={addAdmin} disabled={loading} className="btn-primary">{loading ? "Saving..." : "Add Admin"}</button>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Created</th>
                <th className="px-2 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-2 py-2">{a.name}</td>
                  <td className="px-2 py-2">{a.email}</td>
                  <td className="px-2 py-2">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="px-2 py-2 text-right">
                    <button
                      onClick={() => deleteAdmin(a.id)}
                      disabled={loading}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td className="px-2 py-4 text-center text-gray-500" colSpan={4}>
                    {loading ? "Loading..." : "No admins yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


