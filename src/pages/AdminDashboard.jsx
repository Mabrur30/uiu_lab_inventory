import { useState, useEffect } from "react";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import Card from "../components/common/Card.jsx";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";
import { adminAPI } from "../api/admin";

const EMPTY_DASHBOARD = {
  stats: [],
  recentBookings: [],
  inventory: [],
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboardStats(),
      adminAPI.getRecentBookings(5),
      adminAPI.getComponents(),
    ])
      .then(([statsRes, bookingsRes, componentsRes]) => {
        const stats = statsRes.data || {};
        const bookings = bookingsRes.data || [];
        const components = componentsRes.data || [];

        // Transform stats to display format
        const formattedStats = [
          {
            label: "Pending Requests",
            value: stats.pendingBookings || 0,
            icon: "📋",
            color: "amber",
            description: "Bookings awaiting approval",
          },
          {
            label: "Active Bookings",
            value: stats.activeBookings || 0,
            icon: "📦",
            color: "emerald",
            description: "Currently borrowed items",
          },
          {
            label: "Overdue Items",
            value: stats.overdueBookings || 0,
            icon: "⚠️",
            color: "red",
            description: "Items past return date",
          },
          {
            label: "Total Components",
            value: stats.totalComponents || 0,
            icon: "🔧",
            color: "cyan",
            description: "Items in inventory",
          },
        ];

        // Transform bookings
        const formattedBookings = bookings.map((b) => ({
          id: b.booking_id,
          student: b.full_name || "Unknown",
          studentId: b.user_id,
          component: b.component_name || "Unknown",
          qty: b.quantity,
          purpose: b.purpose || "N/A",
          status: b.status,
        }));

        // Transform inventory
        const formattedInventory = components.slice(0, 5).map((c) => ({
          component: c.name,
          total: c.total_quantity,
          available: c.available_quantity,
          inUse: c.total_quantity - c.available_quantity,
          statusColor: c.available_quantity < 5 ? "red" : "emerald",
        }));

        setDashboard({
          stats: formattedStats,
          recentBookings: formattedBookings,
          inventory: formattedInventory,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard:", err);
        setDashboard(EMPTY_DASHBOARD);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (bookingId) => {
    try {
      await adminAPI.approveBooking(bookingId);
      // Refresh bookings
      const bookingsRes = await adminAPI.getRecentBookings(5);
      const bookings = bookingsRes.data || [];
      setDashboard((prev) => ({
        ...prev,
        recentBookings: bookings.map((b) => ({
          id: b.booking_id,
          student: b.full_name || "Unknown",
          studentId: b.user_id,
          component: b.component_name || "Unknown",
          qty: b.quantity,
          purpose: b.purpose || "N/A",
          status: b.status,
        })),
      }));
    } catch (err) {
      console.error("Failed to approve booking:", err);
      alert("Failed to approve booking");
    }
  };

  const handleReject = async (bookingId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await adminAPI.rejectBooking(bookingId, reason);
      // Refresh bookings
      const bookingsRes = await adminAPI.getRecentBookings(5);
      const bookings = bookingsRes.data || [];
      setDashboard((prev) => ({
        ...prev,
        recentBookings: bookings.map((b) => ({
          id: b.booking_id,
          student: b.full_name || "Unknown",
          studentId: b.user_id,
          component: b.component_name || "Unknown",
          qty: b.quantity,
          purpose: b.purpose || "N/A",
          status: b.status,
        })),
      }));
    } catch (err) {
      console.error("Failed to reject booking:", err);
      alert("Failed to reject booking");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Overview Dashboard">
        <p className="text-sm text-slate-600">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  const getStatColor = (color) => {
    const colors = {
      amber: "border-l-4 border-amber-500 bg-amber-50",
      emerald: "border-l-4 border-emerald-500 bg-emerald-50",
      red: "border-l-4 border-red-500 bg-red-50",
      cyan: "border-l-4 border-cyan-500 bg-cyan-50",
    };
    return colors[color] || colors.emerald;
  };

  return (
    <AdminLayout title="Overview Dashboard">
      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {dashboard.stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${getStatColor(stat.color)} p-4 rounded-lg`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs font-semibold text-slate-600 uppercase">
                  {stat.label}
                </div>
                <div className="text-3xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </div>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-xs text-slate-600">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Recent bookings */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Booking Requests
              </h2>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => (window.location.href = "/admin/bookings")}
            >
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 pr-3 font-semibold">Student</th>
                  <th className="py-3 pr-3 font-semibold">Component</th>
                  <th className="py-3 pr-3 font-semibold">Qty</th>
                  <th className="py-3 pr-3 font-semibold">Purpose</th>
                  <th className="py-3 pr-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 pr-3">
                      <div className="font-semibold text-slate-900">
                        {b.student}
                      </div>
                      <div className="text-xs text-slate-500">
                        {b.studentId}
                      </div>
                    </td>
                    <td className="py-3 pr-3">{b.component}</td>
                    <td className="py-3 pr-3">{b.qty}</td>
                    <td className="py-3 pr-3 text-xs">{b.purpose}</td>
                    <td className="py-3 pr-3">
                      <Badge
                        variant={
                          b.status === "pending"
                            ? "warning"
                            : b.status === "approved"
                              ? "success"
                              : b.status === "rejected"
                                ? "error"
                                : "default"
                        }
                      >
                        {b.status}
                      </Badge>
                    </td>
                    <td className="py-3 space-x-1 flex">
                      {b.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(b.id)}
                            className="px-2 py-1 bg-emerald-500 text-white text-xs rounded font-semibold hover:bg-emerald-600"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(b.id)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded font-semibold hover:bg-red-600"
                          >
                            ✕ Reject
                          </button>
                        </>
                      ) : (
                        <button className="px-2 py-1 border border-slate-300 text-slate-700 text-xs rounded font-semibold">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Inventory Status */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Inventory Status
          </h2>
          <div className="space-y-4">
            {dashboard.inventory.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-semibold text-slate-900">
                    {item.component}
                  </span>
                  <span className="text-xs text-slate-600">
                    {item.available} / {item.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      item.statusColor === "red"
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${(item.available / item.total) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Available: {item.available} · In use: {item.inUse}
                </p>
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600"
            onClick={() => (window.location.href = "/admin/stock")}
          >
            Manage Inventory
          </Button>
        </Card>
      </div>
    </AdminLayout>
  );
}
