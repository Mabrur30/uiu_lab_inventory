import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { adminAPI } from "../../api/admin.js";

const MOCK_STOCK = [
  {
    id: "COMP001",
    component: "Ultrasonic Sensor",
    current: 10,
    available: 2,
    inUse: 8,
    minimum: 5,
    status: "Critical",
    statusColor: "red",
  },
  {
    id: "COMP002",
    component: "Jumper Wires",
    current: 50,
    available: 15,
    inUse: 35,
    minimum: 20,
    status: "Low",
    statusColor: "yellow",
  },
  {
    id: "COMP003",
    component: "Arduino Uno",
    current: 15,
    available: 8,
    inUse: 7,
    minimum: 5,
    status: "Good",
    statusColor: "green",
  },
  {
    id: "COMP004",
    component: "ESP32 Dev Kit",
    current: 20,
    available: 12,
    inUse: 8,
    minimum: 5,
    status: "Good",
    statusColor: "green",
  },
];

export default function StockManagement() {
  const [stock] = useState(MOCK_STOCK);

  const handleAddStock = (componentId) => {
    const qty = prompt("Enter quantity to add:");
    if (qty) {
      adminAPI.addStock(componentId, qty).then(() => {
        alert("Stock added successfully!");
      });
    }
  };

  return (
    <AdminLayout title="Stock Management">
      {/* Alert */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="font-semibold text-yellow-900">
            3 components are running low on stock and need reordering!
          </p>
          <p className="text-sm text-yellow-700">
            Ultrasonic Sensor, Jumper Wires, and Resistor Pack are below minimum
            stock levels.
          </p>
        </div>
      </div>

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
