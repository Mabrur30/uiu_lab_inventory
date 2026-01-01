import AuthenticatedLayout from "../components/layout/AuthenticatedLayout.jsx";
import Card from "../components/common/Card.jsx";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";

export default function Dashboard() {
  const stats = [
    { label: "Active bookings", value: 2, note: "Items currently checked out" },
    { label: "Overdue items", value: 0, note: "Return items before due date" },
    {
      label: "Total penalties",
      value: "৳0",
      note: "Calculated from lab rules",
    },
  ];

  const upcoming = [
    {
      component: "Arduino Uno",
      qty: 1,
      dueDate: "2026-01-03",
      status: "Approved",
    },
    {
      component: "ESP32 Dev Kit",
      qty: 1,
      dueDate: "2025-12-30",
      status: "Requested",
    },
  ];

  return (
    <AuthenticatedLayout title="Dashboard">
      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
              {s.label}
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {s.value}
            </div>
            <div className="text-xs text-slate-500">{s.note}</div>
          </Card>
        ))}
      </div>

      {/* Quick action + upcoming returns */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Quick action
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Need a board or sensor for your lab or final project? Start a
            booking request.
          </p>
          <Button
            className="w-full"
            onClick={() => (window.location.href = "/bookings")}
          >
            + Make new booking
          </Button>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Upcoming returns
            </h2>
            <span className="text-xs text-slate-500">Next 7 days</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-2 pr-3">Component</th>
                  <th className="py-2 pr-3">Qty</th>
                  <th className="py-2 pr-3">Due date</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((u, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-2 pr-3">{u.component}</td>
                    <td className="py-2 pr-3">{u.qty}</td>
                    <td className="py-2 pr-3">
                      {new Date(u.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      <Badge
                        variant={
                          u.status === "Approved" ? "success" : "warning"
                        }
                      >
                        {u.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            For any change in plan, contact the lab in advance.
          </p>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
