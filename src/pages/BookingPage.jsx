import { useState } from "react";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";

const COMPONENTS = [
  {
    id: 1,
    name: "Arduino Uno",
    available: 8,
    location: "Lab A · Shelf 1",
    category: "Microcontroller",
  },
  {
    id: 2,
    name: "ESP32 Dev Kit",
    available: 5,
    location: "Lab A · Shelf 2",
    category: "Microcontroller",
  },
  {
    id: 3,
    name: "Raspberry Pi 4",
    available: 3,
    location: "Lab B · Cabinet 1",
    category: "SBC",
  },
];

export default function BookingPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [expectedReturn, setExpectedReturn] = useState("");
  const [course, setCourse] = useState("");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");

  const filtered = COMPONENTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const submit = (e) => {
    e.preventDefault();
    if (!selected || !expectedReturn || !course) {
      setMessage("Please select a component, return date and course/purpose.");
      return;
    }
    if (qty < 1 || qty > 5 || qty > selected.available) {
      setMessage("Quantity invalid for available stock / max 5 per student.");
      return;
    }
    // later: send to backend
    setMessage("Booking request submitted (mock).");
  };

  return (
    <AuthenticatedLayout title="New Booking">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: list/search */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            New booking
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Request a component from the hardware lab for your lab or project
            work.
          </p>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Search component
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or code (e.g. Arduino, COMP001)"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelected(c);
                  setQty(1);
                  setMessage("");
                }}
                className={`w-full text-left border rounded-md px-3 py-2 text-sm ${
                  selected?.id === c.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-slate-200 hover:border-primary-300"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.category}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-semibold text-primary-600">
                      {c.available} available
                    </div>
                    <div className="text-slate-500">{c.location}</div>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-slate-500 py-4">
                No components match your search.
              </div>
            )}
          </div>
        </Card>

        {/* Right: form */}
        <Card>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Component
              </label>
              <div className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-slate-50">
                {selected ? selected.name : "Select a component from the list"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Max 5 items per student
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Expected return
                </label>
                <input
                  type="date"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Course / purpose
              </label>
              <input
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. CSE 311 final project"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Details (optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Short description of your lab or project work"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>

            {message && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {message}
              </div>
            )}

            <div className="bg-blue-50 text-[11px] text-blue-800 border border-blue-200 rounded-md px-3 py-2">
              Requests must be approved by a lab admin before you can pick up
              the components.
            </div>

            <Button type="submit" className="w-full">
              Submit request
            </Button>
          </form>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
