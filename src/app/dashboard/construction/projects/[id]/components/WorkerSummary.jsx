"use client";

import { useWorkerSummary } from "@/hooks/useExpense";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { User } from "lucide-react";

export default function WorkerSummary({
  projectId,
  workerId,
  open,
  onOpenChange,
}) {
  const { data: workersummary, isLoading } = useWorkerSummary(projectId, workerId);
  const summary = workersummary?.data;

  // console.log("Worker Summary Data:", summary);

  const hasContractAmount =
    summary?.contractAmount !== undefined && summary?.contractAmount > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-900 border border-slate-800 text-white max-w-lg w-[92vw] rounded-xl p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="w-5 h-5 text-secondary-orange shrink-0" />
            <span>
              {isLoading
                ? "Loading Summary..."
                : `${summary?.worker?.name || "Worker"} Summary`}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400 text-xs">
            Overall Expense breakdown for this worker in the current project.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 py-3">
            <Skeleton className="h-16 w-full bg-slate-800 rounded-lg" />
            <Skeleton className="h-16 w-full bg-slate-800 rounded-lg" />
            <Skeleton className="h-16 w-full bg-slate-800 rounded-lg" />
            <Skeleton className="h-16 w-full bg-slate-800 rounded-lg" />
          </div>
        ) : summary ? (
          <div className="space-y-2.5 sm:space-y-3 py-2 text-xs">
            {hasContractAmount && (
              <div className="bg-slate-800/80 p-3 rounded-lg border border-secondary-orange/30">
                <p className="text-slate-400 font-medium">Amount Decided During Agreement</p>
                <p className="text-base sm:text-lg font-bold text-secondary-orange mt-1">
                  {formatCurrency(summary.contractAmount)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <p className="text-slate-400">Total Labour</p>
                <p className="text-sm sm:text-base font-bold text-white mt-1">
                  {formatCurrency(summary?.totalLabour || 0)}
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <p className="text-slate-400">Total Material</p>
                <p className="text-sm sm:text-base font-bold text-white mt-1">
                  {formatCurrency(summary?.totalMaterial || 0)}
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <p className="text-slate-400">Total Paid</p>
                <p className="text-sm sm:text-base font-bold text-green-400 mt-1">
                  {formatCurrency(summary?.totalPaid || 0)}
                </p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <p className="text-slate-400">Remaining Balance</p>
                <p
                  className={`text-sm sm:text-base font-bold mt-1 ${
                    summary?.remainingBalance > 0
                      ? "text-red-400"
                      : "text-slate-200"
                  }`}
                >
                  {formatCurrency(summary?.remainingBalance || 0)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">
            No summary data available for this worker.
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white text-xs">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}