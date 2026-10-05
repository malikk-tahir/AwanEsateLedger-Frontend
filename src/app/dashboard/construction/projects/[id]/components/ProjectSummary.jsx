"use client";

import { useProjectSummary } from "@/hooks/useExpense";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CircleDollarSign,
  HardHat,
  PackageCheck,
  Receipt,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Hash,
  Scale,
} from "lucide-react";

export default function ProjectSummary({ projectId }) {
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProjectSummary(projectId);


  if (isLoading) {
    return (
      <div className="bg-dark/60 border border-slate-800 p-4 sm:p-6 rounded-xl space-y-4">
        <Skeleton className="h-6 w-48 bg-slate-800" />
        <Skeleton className="h-28 w-full bg-slate-800 rounded-lg" />
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="bg-dark/60 border border-red-900/40 p-4 sm:p-6 rounded-xl text-center space-y-3">
        <div className="flex justify-center text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <p className="text-red-400 text-sm font-medium">
          Failed to load project ledger summary metrics.
        </p>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline"
          size="sm"
          className="border-slate-700 text-dark hover:text-white hover:bg-slate-800"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Retrying..." : "Retry"}
        </Button>
      </div>
    );
  }

  const hasDebt = summary.totalOutstandingDebt > 0;

  return (
    <div className="bg-dark/60 border border-slate-800 p-4 sm:p-6 rounded-xl backdrop-blur-md space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="w-5 h-5 text-secondary-orange shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            Project Financial Overview
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800 w-fit">
          <Hash className="w-3.5 h-3.5 text-slate-500" />
          <span>{summary.totalTransactions} Total Transactions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2.5 bg-slate-900/40 p-3.5 sm:p-4 rounded-lg border border-slate-800/60">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Cost Breakdown
          </p>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-400 shrink-0" /> Labour Cost
            </span>
            <span className="font-semibold text-white break-all">
              {formatCurrency(summary.totalLabourCost)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-blue-400 shrink-0" /> Material Cost
            </span>
            <span className="font-semibold text-white break-all">
              {formatCurrency(summary.totalMaterialCost)}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="text-slate-200 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-purple-400 shrink-0" /> Total Project Cost
            </span>
            <span className="text-white break-all">
              {formatCurrency(summary.totalProjectCost)}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 bg-slate-900/40 p-3.5 sm:p-4 rounded-lg border border-slate-800/60">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Settlement Status
          </p>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Amount Paid
            </span>
            <span className="font-semibold text-emerald-400 break-all">
              {formatCurrency(summary.totalAmountPaid)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-300 flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-400 shrink-0" /> Net Balance Status
            </span>
            <span className="text-xs font-medium text-slate-400">
              {hasDebt ? "Outstanding" : "Cleared"}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="text-slate-200 flex items-center gap-2">
              <AlertCircle
                className={`w-4 h-4 shrink-0 ${
                  hasDebt ? "text-red-400" : "text-slate-400"
                }`}
              />
              Outstanding Debt
            </span>
            <span className={hasDebt ? "text-red-400 break-all" : "text-slate-300 break-all"}>
              {formatCurrency(summary.totalOutstandingDebt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}