import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import { adminAPI } from "../../api/admin";

export default function BookingRequests() {
  const [filter, setFilter] = useState("pending");
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllBookings({
        status: filter === "all" ? undefined : filter,
      });
      const bookings = res.data || [];

      // Transform bookings
      const formattedRequests = bookings.map((b) => ({
        id: b.booking_id,
        student: b.full_name || "Unknown",
        studentId: b.user_id,
        component: b.component_name || "Unknown",
        qty: b.quantity,
        purpose: b.purpose || "N/A",
        requested: new Date(b.booking_date).toLocaleDateString(),
        expectedReturn: b.expected_return_date
          ? new Date(b.expected_return_date).toLocaleDateString()
          : "N/A",
        status: b.status,
      }));

      setRequests(formattedRequests);

      // Get counts for each status
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        adminAPI.getAllBookings({ status: "pending" }),
        adminAPI.getAllBookings({ status: "approved" }),
        adminAPI.getAllBookings({ status: "rejected" }),
      ]);

      setCounts({
        pending: (pendingRes.data || []).length,
        approved: (approvedRes.data || []).length,
        rejected: (rejectedRes.data || []).length,
      });

      setLoading(false);
    } catch (err) {
      console.error("Failed to load booking requests:", err);
      setRequests([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const filteredRequests = requests.filter((req) => {
    if (search) {
      return (
        req.student?.toLowerCase().includes(search.toLowerCase()) ||
        req.studentId?.includes(search)
      );
    }
    return true;
  });

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveBooking(id);
      alert("Booking approved!");
      loadBookings();
    } catch (err) {
      console.error("Failed to approve booking:", err);
      alert("Failed to approve booking");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await adminAPI.rejectBooking(id, reason);
      alert("Booking rejected!");
      loadBookings();
    } catch (err) {
      console.error("Failed to reject booking:", err);
      alert("Failed to reject booking");
    }
  };

  return (
    <AdminLayout title="Booking Requests">
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Booking Requests
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Review and approve student booking requests
          </p>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4 border-b border-slate-200">
            {[
              { key: "pending", label: `Pending (${counts.pending})` },
              { key: "approved", label: `Approved (${counts.approved})` },
              { key: "rejected", label: `Rejected (${counts.rejected})` },
              { key: "all", label: "All" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 font-semibold text-sm transition-colors ${
                  filter === tab.key
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-3 px-3 font-semibold">Request ID</th>
                <th className="py-3 px-3 font-semibold">Student</th>
                <th className="py-3 px-3 font-semibold">Component</th>
                <th className="py-3 px-3 font-semibold">Qty</th>
                <th className="py-3 px-3 font-semibold">Purpose</th>
                <th className="py-3 px-3 font-semibold">Requested</th>
                <th className="py-3 px-3 font-semibold">Expected Return</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-3 px-3 font-semibold">{req.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">
                      {req.student}
                    </div>
                    <div className="text-xs text-slate-500">
                      {req.studentId}
                    </div>
                  </td>
                  <td className="py-3 px-3">{req.component}</td>
                  <td className="py-3 px-3">{req.qty}</td>
                  <td className="py-3 px-3 text-xs">{req.purpose}</td>
                  <td className="py-3 px-3 text-xs">{req.requested}</td>
                  <td className="py-3 px-3 text-xs">{req.expectedReturn}</td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        req.status === "pending"
                          ? "warning"
                          : req.status === "approved"
                            ? "success"
                            : "error"
                      }
                    >
                      {req.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 space-x-1 flex">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="px-3 py-1 bg-emerald-500 text-white text-xs rounded font-semibold hover:bg-emerald-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded font-semibold hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button className="px-3 py-1 border border-slate-300 text-slate-700 text-xs rounded font-semibold hover:bg-slate-50">
                      Details
                    </button>
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
