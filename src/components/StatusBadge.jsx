import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    // Real Estate Property Statuses
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    under_offer: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    sold: "bg-rose-500/10 text-rose-400 border-rose-500/30",

    // Construction Project Statuses
    planning: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    on_hold: "bg-rose-500/10 text-rose-400 border-rose-500/20",

    // Society Project Statuses
    active_installment: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    fully_paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };

  const key = status?.toLowerCase();
  const formattedStatus = status ? status.replace(/_/g, " ") : "N/A";

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize whitespace-nowrap ${
        styles[key] || "bg-slate-800 text-slate-300 border-slate-700"
      }`}
    >
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;