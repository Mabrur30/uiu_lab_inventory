// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout.jsx";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { profileAPI } from "../api/profile";

const DEFAULT_PROFILE = {
  name: "Tamvir Hossan",
  studentId: "01122xxxx",
  department: "Computer Science & Engineering",
  email: "tamvir@student.uiu.ac.bd",
  phone: "+880 1712-345678",
  batch: "Fall 2022",
  memberSince: "October 15, 2023",
};

const ACCOUNT_STATS = [
  { label: "Total bookings", value: 15 },
  { label: "Active bookings", value: 2 },
  { label: "Completed", value: 12 },
  { label: "Overdue instances", value: 1 },
];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    returnReminders: true,
    penaltyNotifications: false,
  });
  const [contactMethod, setContactMethod] = useState("Email");

  // Load profile via API
  useEffect(() => {
    profileAPI
      .getProfile()
      .then(() => {
        // When backend is ready, replace with res.data
        setForm(DEFAULT_PROFILE);
        setLoading(false);
      })
      .catch(() => {
        // On error, show mock data
        setForm(DEFAULT_PROFILE);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AuthenticatedLayout title="Profile">
        <p className="text-sm text-slate-600">Loading profile…</p>
      </AuthenticatedLayout>
    );
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = (e) => {
    e.preventDefault();
    profileAPI.updateProfile(form);
    setEditing(false);
  };

  const handleNotificationChange = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    profileAPI.updateNotifications(updated);
  };

  return (
    <AuthenticatedLayout title="Profile">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: avatar + stats */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col items-center py-4">
              <div className="w-24 h-24 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-bold mb-3">
                TH
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                {form.name}
              </h2>
              <p className="text-xs text-slate-500">
                Student · Department of CSE
              </p>
              <div className="mt-3 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-[11px] font-semibold">
                Active since Oct 2023
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Account statistics
            </h3>
            <div className="space-y-2 text-xs">
              {ACCOUNT_STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-slate-600">{s.label}</span>
                  <span className="font-semibold text-slate-900">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column: personal info + security */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Personal information
              </h2>
              <Button
                size="sm"
                variant={editing ? "outline" : "secondary"}
                onClick={() => setEditing((v) => !v)}
              >
                {editing ? "Cancel" : "Edit"}
              </Button>
            </div>

            {editing ? (
              <form onSubmit={onSave} className="space-y-4 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Full name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Student ID
                    </label>
                    <input
                      value={form.studentId}
                      disabled
                      className="w-full border border-slate-200 bg-slate-50 rounded-md px-3 py-2 text-sm text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Department
                  </label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={onChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Save changes
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoRow label="Full name" value={form.name} />
                  <InfoRow label="Student ID" value={form.studentId} />
                </div>
                <InfoRow label="Department" value={form.department} />
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoRow label="Email" value={form.email} />
                  <InfoRow label="Phone" value={form.phone} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoRow label="Batch" value={form.batch} />
                  <InfoRow label="Member since" value={form.memberSince} />
                </div>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Security & preferences
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">
                    Change password
                  </span>
                  <Button size="sm" variant="outline">
                    Update password
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  For security reasons, you&apos;ll be redirected to the
                  password update screen.
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-900 text-sm">
                  Email notifications
                </span>
                <div className="mt-2 space-y-1 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications.bookingUpdates}
                      onChange={() =>
                        handleNotificationChange("bookingUpdates")
                      }
                    />
                    <span>Booking status updates</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications.returnReminders}
                      onChange={() =>
                        handleNotificationChange("returnReminders")
                      }
                    />
                    <span>Return reminders</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications.penaltyNotifications}
                      onChange={() =>
                        handleNotificationChange("penaltyNotifications")
                      }
                    />
                    <span>Penalty notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Preferred contact method
                </label>
                <select
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                >
                  <option>Email</option>
                  <option>Phone</option>
                  <option>SMS</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-medium text-slate-900">{value}</div>
    </div>
  );
}
