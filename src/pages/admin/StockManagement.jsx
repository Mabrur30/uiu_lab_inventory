import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { adminAPI } from "../../api/admin.js";

export default function StockManagement() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState([]);

  const loadStock = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getComponents();
      const components = res.data || [];

      const mapped = components.map((c) => {
        const inUse = c.total_quantity - c.available_quantity;
        const minimum = 5; // Default minimum stock level
        let status = "In Stock";
        if (c.available_quantity === 0) status = "Critical";
        else if (c.available_quantity < minimum) status = "Low";

        return {
          id: c.components_id,
          component: c.name,
          current: c.total_quantity,
          available: c.available_quantity,
          inUse: inUse,
          minimum: minimum,
          status: status,
        };
      });

      setStock(mapped);
      setLowStockItems(
        mapped.filter((i) => i.status === "Critical" || i.status === "Low"),
      );
      setLoading(false);
    } catch (err) {
      console.error("Failed to load stock:", err);
      setStock([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleAddStock = async (componentId) => {
    const qty = prompt("Enter quantity to add:");
    if (!qty || isNaN(parseInt(qty, 10))) return;

    const component = stock.find((s) => s.id === componentId);
    if (!component) return;

    try {
      const newTotal = component.current + parseInt(qty, 10);
      const newAvailable = component.available + parseInt(qty, 10);

      await adminAPI.updateComponent(componentId, {
        total_quantity: newTotal,
        available_quantity: newAvailable,
      });
      alert("Stock added successfully!");
      loadStock();
    } catch (err) {
      console.error("Failed to add stock:", err);
      alert("Failed to add stock");
    }
  };

  return (
    <AdminLayout title="Stock Management">
      {/* Alert */}
      {lowStockItems.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-900">
              {lowStockItems.length} component(s) are running low on stock and
              need reordering!
            </p>
            <p className="text-sm text-yellow-700">
              {lowStockItems.map((i) => i.component).join(", ")} below minimum
              stock levels.
            </p>
          </div>
        </div>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Component Stock Status
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-3 px-3 font-semibold">Component</th>
                <th className="py-3 px-3 font-semibold">Current Stock</th>
                <th className="py-3 px-3 font-semibold">Available</th>
                <th className="py-3 px-3 font-semibold">In Use</th>
                <th className="py-3 px-3 font-semibold">Minimum Stock</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-3 px-3 font-semibold">{item.component}</td>
                  <td className="py-3 px-3">{item.current}</td>
                  <td className="py-3 px-3">{item.available}</td>
                  <td className="py-3 px-3">{item.inUse}</td>
                  <td className="py-3 px-3">{item.minimum}</td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        item.status === "Critical"
                          ? "error"
                          : item.status === "Low"
                            ? "warning"
                            : "success"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleAddStock(item.id)}
                      className="px-3 py-1 bg-emerald-500 text-white text-xs rounded font-semibold hover:bg-emerald-600"
                    >
                      Add Stock
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
