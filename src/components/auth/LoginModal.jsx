import Button from "../common/Button.jsx";

export default function LoginModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Student Portal Login
          </h3>
          <button onClick={onClose} className="text-slate-500">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              placeholder="student@uiu.ac.bd"
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
          <Button className="w-full">Login</Button>
        </div>
      </div>
    </div>
  );
}
