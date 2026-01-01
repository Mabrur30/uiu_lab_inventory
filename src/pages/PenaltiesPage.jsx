import AuthenticatedLayout from "../components/layout/AuthenticatedLayout.jsx";
import Card from "../components/common/Card.jsx";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";

export default function PenaltiesPage() {
  const overview = {
    total: "৳450",
    paid: "৳200",
    pending: "৳250",
  };

  const history = [
    {
      type: "Late return penalty",
      component: "Arduino Uno · BOOK-001",
      info: "Overdue: 5 days · Date: Dec 20, 2025",
      status: "Pending",
      amount: "৳250",
    },
    {
      type: "Damage penalty",
      component: "Ultrasonic Sensor · BOOK-005",
      info: "Broken connector · Date: Dec 10, 2025",
      status: "Paid",
      amount: "৳200",
    },
  ];

  const rules = [
    { label: "Late return", value: "৳50 per day per item" },
    { label: "Minor damage", value: "৳200 – ৳500" },
    { label: "Major damage", value: "৳500 – ৳2000" },
    { label: "Lost item", value: "Full replacement cost" },
  ];

  return (
    <AuthenticatedLayout title="Penalties">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: overview + history */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Penalty overview
            </h2>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Total penalties
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {overview.total}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Paid
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {overview.paid}
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-[11px] font-semibold text-slate-600 uppercase mb-1">
                  Pending
                </div>
                <div className="text-2xl font-bold text-yellow-700">
                  {overview.pending}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Penalty history
            </h2>
            <div className="space-y-3 text-sm">
              {history.map((p, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-lg p-3 bg-slate-50"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-900">
                      {p.type}
                    </span>
                    <Badge
                      variant={p.status === "Paid" ? "success" : "warning"}
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 mb-1">
                    {p.component}
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">
                    {p.info}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {p.amount}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: payment + rules */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Payment information
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 mb-3 text-xs text-yellow-900">
              You have <span className="font-semibold">৳250</span> in pending
              penalties.
            </div>
            <div className="text-xs text-slate-700 mb-3">
              Payment methods:
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Cash at lab office</li>
                <li>bKash: 01XXXXXXXXXX</li>
                <li>Nagad: 01XXXXXXXXXX</li>
              </ul>
            </div>
            <Button className="w-full">Mark as paid</Button>
            <p className="mt-2 text-[11px] text-slate-500 text-center">
              Upload receipt to lab admin for verification.
            </p>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Penalty rules
            </h3>
            <div className="space-y-2 text-xs">
              {rules.map((r) => (
                <div key={r.label}>
                  <div className="font-semibold text-slate-800">{r.label}</div>
                  <div className="text-slate-600">{r.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
