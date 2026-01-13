import { useState } from "react";
import Button from "../common/Button.jsx";

export default function LoginModal({ open, onClose }) {
  const [userType, setUserType] = useState("student"); // or "admin"

  if (!open) return null;

  const handleLogin = () => {
    // Later: actually authenticate
    if (userType === "student") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Login to UIU Lab</h3>
          <button onClick={onClose} className="text-slate-500 text-xl">
            ✕
          </button>
        </div>

        {/* Toggle: Student / Admin */}
        <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-full">
          <button
            onClick={() => setUserType("student")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
              userType === "student"
                ? "bg-primary-500 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setUserType("admin")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
              userType === "admin"
                ? "bg-primary-500 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Admin
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              placeholder={
                userType === "student" ? "student@uiu.ac.bd" : "admin@uiu.ac.bd"
              }
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>

          <div className="text-xs text-slate-600 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
            {userType === "student"
              ? "Login with your student email and password"
              : "Login with your admin credentials"}
          </div>

          <Button className="w-full" onClick={handleLogin}>
            {userType === "student" ? "Student Login" : "Admin Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
