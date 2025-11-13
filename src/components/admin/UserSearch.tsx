// "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSearch() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`);
    const json = await res.json();
    const users = json.data || [];
    setResults(users);
    setLoading(false);
    // if (users.length === 1) {
    //   router.push(`/admin/users/${encodeURIComponent(users[0].email)}`);
    // }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Search by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="px-4 py-2 rounded bg-gray-900 text-white" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="rounded border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <button
                      onClick={() => router.push(`/admin/users/${encodeURIComponent(u.email)}`)}
                      className="px-3 py-1 rounded bg-gray-900 text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



