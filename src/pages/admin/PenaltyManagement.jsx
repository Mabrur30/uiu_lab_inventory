import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import { adminAPI } from "../../api/admin";

export default function PenaltyManagement() {
  const [search, setSearch] = useState("");
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    collected: 0,
    pending: 0,
    students: 0,
  });

  const loadPenalties = async () => {
    try {
      setLoading(true);
      const [penaltiesRes, statsRes] = await Promise.all([
        adminAPI.getAllPenalties(),
        adminAPI.getPenaltyStats(),
      ]);

      const penaltiesData = penaltiesRes.data || [];
      const statsData = statsRes.data || {};

      // Transform penalties
      const mapped = penaltiesData.map((p) => ({
        id: p.penalty_id,
        student: p.full_name || "Unknown",
        studentId: p.user_id,
        component: p.component_name || "N/A",
        type: p.penalty_type,
        amount: p.amount,
        date: new Date(p.penalty_date).toLocaleDateString(),
        status: p.status,
      }));

      setPenalties(mapped);
      setStats({
        total: statsData.totalAmount || 0,
        collected: statsData.paidAmount || 0,
        pending: statsData.pendingAmount || 0,
        students: statsData.studentsWithPenalties || 0,
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to load penalties:", err);
      setPenalties([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPenalties();
  }, []);

  const handleMarkPaid = async (penaltyId) => {
    try {
      await adminAPI.updatePenaltyStatus(penaltyId, "paid");
      alert("Penalty marked as paid!");
      loadPenalties();
    } catch (err) {
      console.error("Failed to update penalty:", err);
      alert("Failed to update penalty status");
    }
  };

  const filteredPenalties = penalties.filter((p) =>
    search
      ? p.student.toLowerCase().includes(search.toLowerCase()) ||
        p.studentId.includes(search)
      : true,
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
                      variant={p.status === "pending" ? "warning" : "success"}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 space-x-1 flex">
                    {p.status === "pending" && (
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
