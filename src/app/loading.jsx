// src/app/loading.jsx

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-50/50">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-600"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-rose-600 tracking-wider">
          MMJ
        </div>
      </div>
    </div>
  );
}