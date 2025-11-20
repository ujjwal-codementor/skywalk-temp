import { GetServerSideProps } from "next";
import { checkAdmin } from "@/lib/checkAdmin";
import AdminNav from "@/components/admin/AdminNav";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useGetApi, usePostApi } from "@/lib/apiCallerClient";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const isAdmin = await checkAdmin(ctx.req as any);
  if (!isAdmin) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
};

interface UserLite { id: string; email: string; fullName: string; createdAt: string }

export default function AdminNotificationsPage() {
  const getApi = useGetApi();
  const postApi = usePostApi();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserLite[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sending, setSending] = useState(false);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const url = `${BACKEND_URL}/api/admin/users?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`;
        const res = await getApi(url);
        const data = res.data?.data || [];
        setUsers(data);
        setTotal(res.data?.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [query, page, pageSize]);

  const toggleSelect = (email: string) => {
    setSelectedEmails((prev) => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]);
  };

  const toggleSelectAllOnPage = () => {
    const pageEmails = users.map(u => u.email);
    const allOnPageSelected = pageEmails.every(e => selectedEmails.includes(e));
    if (allOnPageSelected) {
      setSelectedEmails(prev => prev.filter(e => !pageEmails.includes(e)));
    } else {
      setSelectedEmails(prev => Array.from(new Set([...prev, ...pageEmails])));
    }
  };

  const sendSelected = async () => {
    if (!subject.trim() || !html.trim()) {
      alert("Subject and content are required");
      return;
    }
    if (!selectedEmails.length) {
      alert("Select at least one user or use 'Send to all users'");
      return;
    }
    setSending(true);
    try {
      const res = await postApi(`${BACKEND_URL}/api/admin/notifications/send`, {
        subject: subject.trim(),
        html,
        target: "selected",
        toEmails: selectedEmails,
      });
      if (!res.data?.success) {
        alert(res.data?.error || "Failed to send emails");
        return;
      }
      alert(`Sent ${res.data.sent} emails`);
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Failed");
    } finally {
      setSending(false);
    }
  };

  const sendAll = async () => {
    if (!subject.trim() || !html.trim()) {
      alert("Subject and content are required");
      return;
    }
    if (!confirm("Send to ALL users? This may take a while.")) return;
    setSending(true);
    try {
      const res = await postApi(`${BACKEND_URL}/api/admin/notifications/send`, {
        subject: subject.trim(),
        html,
        target: "all",
      });
      if (!res.data?.success) {
        alert(res.data?.error || "Failed to send emails");
        return;
      }
      alert(`Triggered send to ${res.data.totalRecipients} users; sent ${res.data.sent}`);
    } catch (e: any) {
      alert(e?.response?.data?.error || e?.message || "Failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">Notifications</motion.h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <input
              type="text"
              placeholder="Subject"
              className="w-full rounded border px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <ReactQuill theme="snow" value={html} onChange={setHtml} />
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-50" onClick={sendSelected} disabled={sending}>Send to selected</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50" onClick={sendAll} disabled={sending}>Send to all users</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name or email"
                className="flex-1 rounded border px-3 py-2"
                value={query}
                onChange={(e) => { setPage(1); setQuery(e.target.value); }}
              />
              <button className="px-4 py-2 rounded border" onClick={() => setQuery("")}>Clear</button>
            </div>
            <div className="rounded border bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-3 w-10">
                      <input type="checkbox" checked={users.length > 0 && users.every(u => selectedEmails.includes(u.email))} onChange={toggleSelectAllOnPage} />
                    </th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td className="p-3" colSpan={3}>Loading...</td></tr>
                  ) : users.length ? (
                    users.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="p-3"><input type="checkbox" checked={selectedEmails.includes(u.email)} onChange={() => toggleSelect(u.email)} /></td>
                        <td className="p-3">{u.fullName}</td>
                        <td className="p-3">{u.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td className="p-3" colSpan={3}>No users</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <button className="px-3 py-1 rounded border" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
              <div>Page {page} / {totalPages}</div>
              <button className="px-3 py-1 rounded border" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


