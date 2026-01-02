// src/pages/MyBookings.jsx
import { useState, useEffect } from "react";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout.jsx";
import Card from "../components/common/Card.jsx";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";
import { bookingsAPI } from "../api/bookings";

const MOCK_BOOKINGS = [
  {
    id: "BOOK-001",
    component: "Arduino Uno",
    qty: 1,
    requested: "2025-12-26",
    expected: "2025-12-30",
    status: "Approved",
    penalty: "৳0",
  },
  {
    id: "BOOK-002",
    component: "Ultrasonic Sensor",
    qty: 2,
    requested: "2025-12-20",
    expected: "2025-12-25",
    status: "Returned",
    penalty: "৳0",
  },
  {
    id: "BOOK-003",
    component: "ESP32 Dev Kit",
    qty: 1,
    requested: "2025-12-27",
    expected: "2026-01-03",
    status: "Requested",
    penalty: "৳0",
  },
];

const STATUS_FILTERS = ["All", "Active", "Completed", "Overdue"];

function statusMatchesFilter(booking, filter) {
  if (filter === "All") return true;
  if (filter === "Active")
    return booking.status === "Approved" || booking.status === "Requested";
  if (filter === "Completed") return booking.status === "Returned";
  if (filter === "Overdue") return booking.status === "Overdue";
  return true;
}

function badgeVariant(status) {
  if (status === "Approved") return "success";
  if (status === "Requested") return "warning";
  if (status === "Returned") return "default";
  if (status === "Overdue") return "error";
  return "default";
}

export default function MyBookings() {
  const [filter, setFilter] = useState("All");
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [loading, setLoading] = useState(true);

  // Load bookings via API
  useEffect(() => {
    const filterParam = filter === "All" ? "all" : filter.toLowerCase();

    bookingsAPI
      .getBookings(filterParam)
      .then(() => {
        // When backend is ready, replace with res.data
        setBookings(
          MOCK_BOOKINGS.filter((b) => statusMatchesFilter(b, filter))
        );
        setLoading(false);
      })
      .catch(() => {
        // On error, show mock data
        setBookings(
          MOCK_BOOKINGS.filter((b) => statusMatchesFilter(b, filter))
        );
        setLoading(false);
      });
  }, [filter]);

  if (loading) {
    return (
      <AuthenticatedLayout title="My bookings">
        <p className="text-sm text-slate-600">Loading bookings…</p>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="My bookings">
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              My bookings
            </h2>
            <p className="text-xs text-slate-600">
              Track the status of all your booking requests and returns.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => (window.location.href = "/bookings")}
          >
            + New booking
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full border ${
                filter === f
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-slate-700 border-slate-200 hover:border-primary-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-2 pr-3">Booking ID</th>
                <th className="py-2 pr-3">Component</th>
                <th className="py-2 pr-3">Qty</th>
                <th className="py-2 pr-3">Requested</th>
                <th className="py-2 pr-3">Expected return</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2">Penalty</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-2 pr-3">{b.id}</td>
                  <td className="py-2 pr-3">{b.component}</td>
                  <td className="py-2 pr-3">{b.qty}</td>
                  <td className="py-2 pr-3">
                    {new Date(b.requested).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-3">
                    {new Date(b.expected).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-3">
                    <Badge variant={badgeVariant(b.status)}>{b.status}</Badge>
                  </td>
                  <td className="py-2">{b.penalty}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td className="py-4 text-center text-slate-500" colSpan={7}>
                    No bookings in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AuthenticatedLayout>
  );
}
