"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CreateSocietyProject from "./components/CreateSocietyProject";
import { formatCurrency } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import {
  Plus,
  Building2,
  Tag,
  ArrowRight,
  RefreshCw,
  FolderTree,
} from "lucide-react";
import { useAllSocieties } from "@/hooks/useSociety";

export default function SocietyProjectsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    data: societiesResponse,
    isLoading,
    isError,
    refetch,
  } = useAllSocieties();

  const societies = societiesResponse?.data || [];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-dark p-4 sm:p-5 rounded-xl border border-slate-700/60 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex flex-wrap items-center gap-2">
            Society Projects
            <span className="text-xs bg-secondary-orange/10 text-secondary-orange px-2.5 py-0.5 rounded-full font-semibold border border-secondary-orange/20">
              {societies.length} Total
            </span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            Track and manage housing society files, plots, installment plans, and project inventories.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto bg-secondary-orange hover:bg-secondary-orange/80 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-xs sm:text-sm h-9 sm:h-10 border-none"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Society Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-dark border border-slate-700/60 p-4 sm:p-5 rounded-xl space-y-4 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/2 bg-slate-700 " />
                <Skeleton className="h-5 w-20 bg-slate-700  rounded-full" />
              </div>
              <Skeleton className="h-4 w-3/4 bg-slate-700 " />
              <Skeleton className="h-10 bg-slate-700  rounded-lg" />
              <Skeleton className="h-9 w-full bg-slate-700  rounded-lg" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-dark border border-red-500/20 rounded-xl p-6 sm:p-8 text-center space-y-3">
          <p className="text-red-400 text-xs sm:text-sm">Failed to load society project listings.</p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:text-white bg-dark hover:bg-slate-800 text-xs sm:text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      ) : societies.length === 0 ? (
        <div className="bg-dark border border-slate-700/60 rounded-xl p-8 sm:p-12 text-center space-y-3 shadow-lg">
          <FolderTree className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto" />
          <h3 className="text-base sm:text-lg font-semibold text-white">No Society Projects Found</h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto">
            Get started by adding your first society file or plot record to manage installments.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-secondary-orange hover:bg-secondary-orange/80 text-white font-bold mt-2 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Society Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {societies.map((society) => {
            const societyId = society._id || society.id;

            return (
              <div
                key={societyId}
                className="bg-dark border border-slate-700/60 hover:border-slate-500/80 p-4 sm:p-5 rounded-xl transition-all duration-200 group flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-secondary-orange/10 border border-secondary-orange/20 flex items-center justify-center text-secondary-orange font-bold shrink-0">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-secondary-orange transition-colors line-clamp-1">
                          {society.societyName}
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                          No: <span className="font-medium text-slate-300">{society.fileOrPlotNumber}</span>
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={society.status} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-700/50">
                    <div className="bg-slate-700 px-3 py-2 rounded-lg border border-slate-800 flex-1 mr-3">
                      <span className="text-slate-400 flex items-center gap-1 text-[10px] sm:text-[11px]">
                        <Tag className="w-3 h-3 text-secondary-orange shrink-0" /> Total Price
                      </span>
                      <p className="text-white font-bold text-xs sm:text-sm mt-0.5 truncate">
                        {formatCurrency(society.totalPrice)}
                      </p>
                    </div>

                    <span className="capitalize px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 font-medium border border-slate-700/50 text-xs shrink-0">
                      {society.type}
                    </span>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-700/50">
                  <Link
                    href={`/dashboard/society/${societyId}`}
                    className="w-full bg-slate-700  hover:bg-secondary-orange hover:text-white text-slate-200 font-medium text-xs h-8 sm:h-9 transition-colors flex items-center justify-center gap-2 group/btn rounded-md border border-slate-700/50 hover:border-secondary-orange"
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

      <CreateSocietyProject open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}