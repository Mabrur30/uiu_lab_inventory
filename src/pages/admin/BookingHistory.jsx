import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import { adminAPI } from "../../api/admin";

export default function BookingHistory() {
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        // Get completed/returned bookings
        const res = await adminAPI.getAllBookings({ status: "returned" });
        const bookings = res.data || [];

        const mapped = bookings.map((b) => {
          const checkoutDate = new Date(b.booking_date);
          const returnDate = b.actual_return_date
            ? new Date(b.actual_return_date)
            : null;
          const duration = returnDate
            ? Math.ceil((returnDate - checkoutDate) / (1000 * 60 * 60 * 24))
            : "N/A";

          return {
            id: b.booking_id,
            student: b.full_name || "Unknown",
            studentId: b.user_id,
            component: b.component_name || "Unknown",
            checkoutDate: checkoutDate.toLocaleDateString(),
            returnDate: returnDate ? returnDate.toLocaleDateString() : "N/A",
            duration:
              typeof duration === "number" ? `${duration} days` : duration,
            status: b.status,
          };
        });

        setHistory(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load booking history:", err);
        setHistory([]);
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredHistory = history.filter((h) =>
    search
      ? h.student?.toLowerCase().includes(search.toLowerCase()) ||
        h.studentId?.includes(search)
      : true,
  );

  return (
    <AdminLayout title="Booking History">
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Booking History
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Admin Portal · UIU Hardware Lab Inventory
          </p>
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-3 px-3 font-semibold">Booking ID</th>
                <th className="py-3 px-3 font-semibold">Student</th>
                <th className="py-3 px-3 font-semibold">Component</th>
                <th className="py-3 px-3 font-semibold">Checkout Date</th>
                <th className="py-3 px-3 font-semibold">Return Date</th>
                <th className="py-3 px-3 font-semibold">Duration</th>
                <th className="py-3 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((h) => (
                <tr
                  key={h.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-3 px-3 font-semibold">{h.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">
                      {h.student}
                    </div>
                    <div className="text-xs text-slate-500">{h.studentId}</div>
                  </td>
                  <td className="py-3 px-3">{h.component}</td>
                  <td className="py-3 px-3 text-xs">{h.checkoutDate}</td>
                  <td className="py-3 px-3 text-xs">{h.returnDate}</td>
                  <td className="py-3 px-3">{h.duration}</td>
                  <td className="py-3 px-3">
                    <Badge variant="success">{h.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
