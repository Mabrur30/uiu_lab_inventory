import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";

const MOCK_STUDENTS = [
  {
    id: "011221234",
    name: "Tanvir Hossan",
    department: "CSE",
    activeBookings: 2,
    totalBookings: 15,
    penalties: "৳ 250",
    status: "Active",
  },
  {
    id: "011223456",
    name: "Sabrina Khan",
    department: "CSE",
    activeBookings: 1,
    totalBookings: 8,
    penalties: "৳ 0",
    status: "Active",
  },
  {
    id: "011224567",
    name: "Rakib Ahmed",
    department: "CSE",
    activeBookings: 3,
    totalBookings: 22,
    penalties: "৳ 0",
    status: "Active",
  },
];

export default function StudentManagement() {
  const [search, setSearch] = useState("");
  const [students] = useState(MOCK_STUDENTS);

  const filteredStudents = students.filter((s) =>
    search
      ? s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.includes(search)
      : true
  );

  return (
    <AdminLayout title="Student Management">
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Student Management
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            View and manage student accounts
          </p>
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-3 px-3 font-semibold">Student ID</th>
                <th className="py-3 px-3 font-semibold">Name</th>
                <th className="py-3 px-3 font-semibold">Department</th>
                <th className="py-3 px-3 font-semibold">Active Bookings</th>
                <th className="py-3 px-3 font-semibold">Total Bookings</th>
                <th className="py-3 px-3 font-semibold">Penalties</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-3 px-3 font-semibold">{s.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {s.name}
                  </td>
                  <td className="py-3 px-3">{s.department}</td>
                  <td className="py-3 px-3">{s.activeBookings}</td>
                  <td className="py-3 px-3">{s.totalBookings}</td>
                  <td className="py-3 px-3 font-semibold text-red-600">
                    {s.penalties}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="success">{s.status}</Badge>
                  </td>
                  <td className="py-3 px-3 space-x-1 flex">
                    <button className="px-3 py-1 border border-slate-300 text-slate-700 text-xs rounded font-semibold hover:bg-slate-50">
                      View
                    </button>
                    <button className="px-3 py-1 border border-slate-300 text-slate-700 text-xs rounded font-semibold hover:bg-slate-50">
                      History
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
