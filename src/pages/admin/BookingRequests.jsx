import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import { adminAPI } from "../../api/admin";

const MOCK_BOOKINGS = {
  pending: 8,
  approved: 45,
  rejected: 5,
  requests: [
    {
      id: "REQ-089",
      student: "Tanvir Hossan",
      studentId: "011221234",
      component: "Arduino Uno",
      qty: 2,
      purpose: "CSE 311 Lab",
      requested: "2026-01-12",
      expectedReturn: "2026-01-20",
      status: "Pending",
    },
    {
      id: "REQ-088",
      student: "Sabrina Khan",
      studentId: "011223456",
      component: "ESP32 Dev Kit",
      qty: 1,
      purpose: "IoT Project",
      requested: "2026-01-12",
      expectedReturn: "2026-01-25",
      status: "Pending",
    },
    {
      id: "REQ-087",
      student: "Fahim Rahman",
      studentId: "011224567",
      component: "Ultrasonic Sensor",
      qty: 3,
      purpose: "EEE 305 Lab",
      requested: "2026-01-11",
      expectedReturn: "2026-01-18",
      status: "Pending",
    },
  ],
};

export default function BookingRequests() {
  const [filter, setFilter] = useState("pending");
  const [bookings] = useState(MOCK_BOOKINGS);
  const [search, setSearch] = useState("");

  const filteredRequests = bookings.requests.filter((req) => {
    if (search) {
      return (
        req.student.toLowerCase().includes(search.toLowerCase()) ||
        req.studentId.includes(search)
      );
    }
    return true;
  });

  const handleApprove = (id) => {
    adminAPI.approveBooking(id).then(() => {
      alert("Booking approved!");
    });
  };

  const handleReject = (id) => {
    adminAPI.rejectBooking(id).then(() => {
      alert("Booking rejected!");
    });
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
              { key: "pending", label: `Pending (${bookings.pending})` },
              { key: "approved", label: `Approved (${bookings.approved})` },
              { key: "rejected", label: `Rejected (${bookings.rejected})` },
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
                        req.status === "Pending"
                          ? "warning"
                          : req.status === "Approved"
                          ? "success"
                          : "error"
                      }
                    >
                      {req.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 space-x-1 flex">
                    {req.status === "Pending" && (
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
