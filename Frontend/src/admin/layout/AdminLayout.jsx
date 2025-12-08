import Sidebar from "../components/Sidebar";
export default function AdminLayout({ children }) {
  return (
    <div className="flex bg-black text-white min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
