import { useState } from "react";
import { useGetApi } from "@/lib/apiCallerClient";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

export default function DirectBookingLink() {
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    name: "",
    email: "",
    notes: "",
  });
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const getApi = useGetApi();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const generateBookingLink = async () => {
    setIsGenerating(true);
    try {
      
      const res = await getApi<{ url: string }>(`${BACKEND_URL}/api/admin/booking`);
      const baseUrl = res.data.url;

      if (!baseUrl) {
        throw new Error("No base URL returned");
      }

      const params = new URLSearchParams();
      if (bookingData.date) params.append("date", bookingData.date);
      if (bookingData.time) params.append("time", bookingData.time);
      if (bookingData.name) params.append("name", bookingData.name);
      if (bookingData.email) params.append("email", bookingData.email);
      if (bookingData.notes) params.append("notes", bookingData.notes);

      const finalUrl = `${baseUrl}?${params.toString()}`;
      setGeneratedLink(finalUrl);
    } catch (err) {
      console.error("Error generating link:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNextAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const next = new Date(today);
      next.setDate(today.getDate() + i);
      if (next.getDay() !== 0 && next.getDay() !== 6) {
        dates.push(next.toISOString().split("T")[0]);
      }
    }
    return dates;
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let h = 9; h <= 17; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      if (h < 17) slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Generate Direct Booking Link</h2>

      <div className="space-y-3">
        <select
          name="date"
          value={bookingData.date}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select Date</option>
          {getNextAvailableDates().map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          value={bookingData.name}
          onChange={handleChange}
          placeholder="Customer Name (optional)"
          className="w-full border rounded p-2"
        />
        <input
          type="email"
          name="email"
          value={bookingData.email}
          onChange={handleChange}
          placeholder="Customer Email (optional)"
          className="w-full border rounded p-2"
        />
        <textarea
          name="notes"
          value={bookingData.notes}
          onChange={handleChange}
          placeholder="Notes (optional)"
          className="w-full border rounded p-2"
        />

        <button
          onClick={generateBookingLink}
          disabled={isGenerating}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:opacity-50 flex items-center justify-center"
        >
          {isGenerating && (
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
          )}
          {isGenerating ? "Generating..." : "Generate Booking Link"}
        </button>
      </div>

      {generatedLink && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <p className="text-sm font-mono break-all">{generatedLink}</p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={copyToClipboard}
              className="bg-gray-700 text-white px-3 py-1 rounded"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Open
            </a>
          </div>
        </div>
      )}
    </div>
  );
}








