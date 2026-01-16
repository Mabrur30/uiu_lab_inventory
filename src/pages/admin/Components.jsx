import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { adminAPI } from "../../api/admin";

export default function Components() {
  const [search, setSearch] = useState("");
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = () => {
    setLoading(true);
    adminAPI
      .getComponents()
      .then((res) => {
        // Map backend response to frontend format
        const mapped = (res.data || []).map((c) => ({
          id: c.components_id,
          code:
            c.component_code ||
            `COMP${String(c.components_id).padStart(3, "0")}`,
          component: c.name,
          category: c.category || "Uncategorized",
          totalStock: c.total_quantity,
          available: c.available_quantity,
          inUse: c.total_quantity - c.available_quantity,
          location: c.location || "Lab A",
          status: c.status || "available",
        }));
        setComponents(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load components:", err);
        setComponents([]);
        setLoading(false);
      });
  };

  const filteredComponents = components.filter((c) =>
    search
      ? c.component.toLowerCase().includes(search.toLowerCase()) ||
        c.id.includes(search)
      : true,
  );

  const handleDelete = async (componentId) => {
    if (confirm("Are you sure you want to delete this component?")) {
      try {
        await adminAPI.deleteComponent(componentId);
        alert("Component deleted!");
        loadComponents();
      } catch (err) {
        console.error("Failed to delete component:", err);
        alert("Failed to delete component");
      }
    }
  };

  return (
    <AdminLayout title="Components">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Component Inventory
            </h2>
            <p className="text-sm text-slate-600">
              Manage all lab components and their availability
            </p>
          </div>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => (window.location.href = "/admin/add-component")}
          >
            + Add New
          </Button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-3 px-3 font-semibold">Component ID</th>
                <th className="py-3 px-3 font-semibold">Name</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Total Stock</th>
                <th className="py-3 px-3 font-semibold">Available</th>
                <th className="py-3 px-3 font-semibold">In Use</th>
                <th className="py-3 px-3 font-semibold">Location</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComponents.map((comp) => (
                <tr
                  key={comp.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-3 px-3 font-semibold">{comp.code}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {comp.component}
                  </td>
                  <td className="py-3 px-3 text-xs">{comp.category}</td>
                  <td className="py-3 px-3">{comp.totalStock}</td>
                  <td className="py-3 px-3">{comp.available}</td>
                  <td className="py-3 px-3">{comp.inUse}</td>
                  <td className="py-3 px-3 text-xs">{comp.location}</td>
                  <td className="py-3 px-3">
                    <Badge variant="success">{comp.status}</Badge>
                  </td>
                  <td className="py-3 px-3 space-x-1 flex">
                    <button className="px-3 py-1 border border-slate-300 text-slate-700 text-xs rounded font-semibold hover:bg-slate-50">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comp.id)}
                      className="px-3 py-1 border border-red-300 text-red-600 text-xs rounded font-semibold hover:bg-red-50"
                    >
                      Delete
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
