"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CreateConstruction from "./components/CreateConstruction";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "../../../../components/StatusBadge";
import {
  Plus,
  Building2,
  MapPin,
  Wallet,
  Calendar,
  ArrowRight,
  RefreshCw,
  HardHat,
} from "lucide-react";
import { useAllProjects } from "@/hooks/useConstruction";

export default function ConstructionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: projectsResponse, isLoading, isError, refetch } = useAllProjects();
  const projects = projectsResponse?.data || [];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark p-5 rounded-xl border border-slate-700/60 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            Construction Projects
            <span className="text-xs bg-secondary-orange/10 text-secondary-orange px-2.5 py-0.5 rounded-full font-semibold border border-dark/20">
              {projects.length} Active
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Monitor active construction sites, budgets, and project schedules.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto bg-secondary-orange hover:bg-secondary-orange/80 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border-none"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-dark border border-slate-700/60 p-5 rounded-xl space-y-4 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/2 bg-slate-700" />
                <Skeleton className="h-5 w-20 bg-slate-700 rounded-full" />
              </div>
              <Skeleton className="h-4 w-3/4 bg-slate-700" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Skeleton className="h-10 bg-slate-700 rounded-lg" />
                <Skeleton className="h-10 bg-slate-700 rounded-lg" />
              </div>
              <Skeleton className="h-9 w-full bg-slate-700 rounded-lg" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-dark border border-red-500/20 rounded-xl p-8 text-center space-y-3">
          <p className="text-red-400 text-sm">Failed to load construction projects.</p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white bg-dark hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-dark border border-slate-700/60 rounded-xl p-8 sm:p-12 text-center space-y-3">
          <HardHat className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-semibold text-white">No Projects Found</h3>
          <p className="text-slate-300 text-sm max-w-sm mx-auto">
            Get started by creating your first construction site project.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-secondary-orange hover:bg-secondary-orange/80 text-white font-bold mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {projects.map((project) => {
            const projectId = project._id || project.id;

            return (
              <div
                key={projectId}
                className="bg-dark border border-slate-700/60 hover:border-slate-500/80 p-5 rounded-xl transition-all duration-200 group flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-secondary-orange/10 border border-secondary-orange/20 flex items-center justify-center text-secondary-orange font-bold shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base group-hover:text-secondary-orange transition-colors truncate">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-300 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{project.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={project.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-700/50 text-xs">
                    <div className="bg-slate-700 p-2.5 rounded-lg border border-slate-700/40">
                      <span className="text-slate-300 flex items-center gap-1 text-[11px]">
                        <Wallet className="w-3 h-3 text-secondary-orange" /> Budget
                      </span>
                      <p className="text-white font-bold text-xs sm:text-sm mt-0.5 truncate">
                        {formatCurrency(project.totalBudget)}
                      </p>
                    </div>

                    <div className="bg-slate-700 p-2.5 rounded-lg border border-slate-700/40">
                      <span className="text-slate-300 flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-secondary-orange" /> Start Date
                      </span>
                      <p className="text-white font-medium text-xs sm:text-sm mt-0.5 truncate">
                        {formatDate(project.startDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/50">
                  <Link
                    href={`/dashboard/construction/projects/${projectId}`}
                    className="w-full bg-slate-700 hover:bg-secondary-orange hover:text-white text-slate-200 font-medium text-xs h-9 transition-all flex items-center justify-center gap-2 group/btn rounded-md border border-slate-700/60"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateConstruction open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}