import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import { adminAPI } from "../../api/admin";

const MOCK_PENALTIES = [
  {
    id: "PEN-045",
    student: "Tanvir Hossan",
    studentId: "011221234",
    component: "Arduino Uno",
    type: "Late Return (5 days)",
    amount: 250,
    date: "2025-12-20",
    status: "Pending",
  },
  {
    id: "PEN-044",
    student: "Fahim Rahman",
    studentId: "011225678",
    component: "ESP32 Dev Kit",
    type: "Damage",
    amount: 500,
    date: "2025-12-15",
    status: "Pending",
  },
];

export default function PenaltyManagement() {
  const [search, setSearch] = useState("");
  const [penalties] = useState(MOCK_PENALTIES);

  const stats = {
    total: 12500,
    collected: 8000,
    pending: 4500,
    students: 12,
  };

  const handleMarkPaid = (penaltyId) => {
    adminAPI.markPenaltyPaid(penaltyId).then(() => {
      alert("Penalty marked as paid!");
    });
  };

  const filteredPenalties = penalties.filter((p) =>
    search
      ? p.student.toLowerCase().includes(search.toLowerCase()) ||
        p.studentId.includes(search)
      : true
  );

  return (
    <AdminLayout title="Penalty Management">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          {
            label: "TOTAL PENALTIES",
            value: `৳ ${stats.total}`,
            color: "bg-emerald-50",
          },
          {
            label: "COLLECTED",
            value: `৳ ${stats.collected}`,
            color: "bg-emerald-50",
          },
          {
            label: "PENDING",
            value: `৳ ${stats.pending}`,
            color: "bg-red-50",
          },
          {
            label: "STUDENTS WITH PENALTIES",
            value: stats.students,
            color: "bg-yellow-50",
          },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.color} p-4 rounded-lg`}>
            <div className="text-xs font-semibold text-slate-600 uppercase">
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Penalty Management
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Track and manage student penalties
          </p>
          <input
            type="text"
            placeholder="Search penalties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-3 px-3 font-semibold">Penalty ID</th>
                <th className="py-3 px-3 font-semibold">Student</th>
                <th className="py-3 px-3 font-semibold">Component</th>
                <th className="py-3 px-3 font-semibold">Type</th>
                <th className="py-3 px-3 font-semibold">Amount</th>
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPenalties.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-3 px-3 font-semibold">{p.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">
                      {p.student}
                    </div>
                    <div className="text-xs text-slate-500">{p.studentId}</div>
                  </td>
                  <td className="py-3 px-3">{p.component}</td>
                  <td className="py-3 px-3 text-xs">{p.type}</td>
                  <td className="py-3 px-3 font-semibold text-red-600">
                    ৳ {p.amount}
                  </td>
                  <td className="py-3 px-3 text-xs">{p.date}</td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={p.status === "Pending" ? "warning" : "success"}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 space-x-1 flex">
                    {p.status === "Pending" && (
                      <button
                        onClick={() => handleMarkPaid(p.id)}
                        className="px-3 py-1 bg-emerald-500 text-white text-xs rounded font-semibold hover:bg-emerald-600"
                      >
                        Mark Paid
                      </button>
                    )}
                    <button className="px-3 py-1 border border-slate-300 text-slate-700 text-xs rounded font-semibold">
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
