"use client";

import React from "react";
import { useAllProjects } from "@/hooks/useConstruction";
import { useAllProperties } from "@/hooks/useProperty";
import { useAllSocieties } from "@/hooks/useSociety";
import { useAllWorkers } from "@/hooks/useWorker";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Home,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  HardHat,
  Sparkles,
  RotateCw,
} from "lucide-react";

export default function DashboardOverview() {
  const {
    data: projectsRes,
    isLoading: loadingProjects,
    isError: errorProjects,
    refetch: refetchProjects,
  } = useAllProjects();

  const {
    data: propertiesRes,
    isLoading: loadingProperties,
    isError: errorProperties,
    refetch: refetchProperties,
  } = useAllProperties();

  const {
    data: societiesRes,
    isLoading: loadingSocieties,
    isError: errorSocieties,
    refetch: refetchSocieties,
  } = useAllSocieties();

  const {
    data: workersRes,
    isLoading: loadingWorkers,
    isError: errorWorkers,
    refetch: refetchWorkers,
  } = useAllWorkers();

  const isLoading =
    loadingProjects || loadingProperties || loadingSocieties || loadingWorkers;
  const isError =
    errorProjects || errorProperties || errorSocieties || errorWorkers;

  const handleRefetchAll = () => {
    refetchProjects();
    refetchProperties();
    refetchSocieties();
    refetchWorkers();
  };

  const projects = projectsRes?.data || projectsRes || [];
  const properties = propertiesRes?.data || propertiesRes || [];
  const societies = societiesRes?.data || societiesRes || [];
  const workers = workersRes?.data || workersRes || [];

  const activeProjects = projects.filter(
    (p) => p.status === "in_progress" || p.status === "active"
  ).length;
  const totalProjectBudget = projects.reduce(
    (acc, p) => acc + (p.totalBudget || p.budget || 0),
    0
  );

  const availableProperties = properties.filter(
    (p) => p.status === "available"
  ).length;
  const soldProperties = properties.filter((p) => p.status === "sold").length;

  const totalWorkersCount = workers.length;

  const statCards = [
    {
      title: "Construction Projects",
      value: projects.length,
      subText: `${activeProjects} in progress`,
      icon: Building2,
      accentColor: "border-l-amber-500",
      iconColor: "text-amber-400 bg-amber-500/10",
      badgeColor: "bg-amber-500/20 text-amber-300",
    },
    {
      title: "Real Estate Properties",
      value: properties.length,
      subText: `${soldProperties} sold · ${availableProperties} available`,
      icon: Home,
      accentColor: "border-l-emerald-500",
      iconColor: "text-emerald-400 bg-emerald-500/10",
      badgeColor: "bg-emerald-500/20 text-emerald-300",
    },
    {
      title: "Housing Societies",
      value: societies.length,
      subText: "Registered societies",
      icon: MapPin,
      accentColor: "border-l-indigo-500",
      iconColor: "text-indigo-400 bg-indigo-500/10",
      badgeColor: "bg-indigo-500/20 text-indigo-300",
    },
    {
      title: "Workforce Personnel",
      value: totalWorkersCount,
      subText: `${totalWorkersCount} total registered workers`,
      icon: Users,
      accentColor: "border-l-cyan-500",
      iconColor: "text-cyan-400 bg-cyan-500/10",
      badgeColor: "bg-cyan-500/20 text-cyan-300",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full bg-slate-800 rounded-xl" />
          <Skeleton className="h-64 w-full bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center space-y-4 shadow-lg">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <p className="text-rose-400 text-sm font-medium">
            Failed to load dashboard metrics. Please try again.
          </p>
          <button
            onClick={handleRefetchAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Real-time analytics across projects, properties, societies, and workforce.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 bg-dark text-white rounded-lg text-xs font-semibold shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Live Metrics</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-dark border-l-4 ${card.accentColor} border-y border-r border-slate-800 p-5 rounded-xl space-y-4 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-lg ${card.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {card.value}
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${card.badgeColor}`}
                  >
                    {card.subText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark border border-slate-800 p-6 rounded-xl space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Operational Overview
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-400">System Totals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-700 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Total Construction Budget</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-400">
                {formatCurrency(totalProjectBudget)}
              </div>
            </div>

            <div className="bg-slate-700 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <HardHat className="w-4 h-4 text-cyan-400" />
                <span>Total Workers</span>
              </div>
              <div className="text-xl font-extrabold text-cyan-400">
                {totalWorkersCount} Registered
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark border border-slate-800 p-6 rounded-xl space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Recent Construction
              </h2>
            </div>
            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
              {projects.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between p-3.5 rounded-lg bg-slate-700 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {project.name || "Unnamed Project"}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {project.location || "No location specified"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-200">
                    {formatCurrency(project.totalBudget || project.budget || 0)}
                  </div>
                  <span className="text-[10px] font-semibold text-amber-400 capitalize">
                    {project.status?.replace("_", " ") || "Pending"}
                  </span>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6 border border-dashed border-slate-800 rounded-lg">
                No construction projects recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}