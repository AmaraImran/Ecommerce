// DashboardCard.jsx
export default function DashboardCard({ title, count, icon }) {
  return (
    <div className="bg-[#151515] border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:bg-[#1a1a1a] transition">
      <div className="space-y-1">
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-white">{count}</h2>
      </div>

      <div className="bg-gray-900 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  );
}
