"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddCategory from "./components/AddCategory";
import AddPersonalExpense from "./components/AddPersonalExpense";
import { formatCurrency } from "@/lib/utils";
import PersonalTransactions from "./components/PersonalTransactions";
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  FolderPlus,
} from "lucide-react";
import { usePersonalTransactionSummary } from "@/hooks/usePersonalTransaction";

export default function PersonalTransactionsPage() {
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const {
    data: summaryResponse,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = usePersonalTransactionSummary();

  const summary = summaryResponse?.summary || {
    totalIncoming: 0,
    totalOutgoing: 0,
    netBalance: 0,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark p-5 rounded-xl border border-slate-700/60 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            Personal Transactions
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Track your personal income, expenses, categories, and financial health.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setIsCategoryOpen(true)}
            variant="outline"
            className="w-full sm:w-auto bg-slate-300 hover:bg-secondary-orange text-black font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border-none"
          >
            <FolderPlus className="w-4 h-4" />
            Add Category
          </Button>

          <Button
            onClick={() => setIsTransactionOpen(true)}
            className="w-full sm:w-auto bg-secondary-orange hover:bg-secondary-orange/80 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border-none"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Personal Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoadingSummary ? (
          <>
            <Skeleton className="h-24 bg-slate-800 rounded-xl" />
            <Skeleton className="h-24 bg-slate-800 rounded-xl" />
            <Skeleton className="h-24 bg-slate-800 rounded-xl" />
          </>
        ) : isErrorSummary ? (
          <div className="col-span-3 bg-dark border border-red-500/20 rounded-xl p-4 text-center">
            <p className="text-red-400 text-xs sm:text-sm">
              Failed to load summary statistics.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-dark border border-slate-700/60 p-4 rounded-xl shadow-lg flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-medium">
                  Net Balance
                </span>
                <p
                  className={`text-lg sm:text-xl font-bold mt-1 ${
                    summary.netBalance >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formatCurrency(summary.netBalance)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-dark border border-slate-700/60 p-4 rounded-xl shadow-lg flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-medium">
                  Total Incoming
                </span>
                <p className="text-lg sm:text-xl font-bold text-emerald-400 mt-1">
                  {formatCurrency(summary.totalIncoming)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-dark border border-slate-700/60 p-4 rounded-xl shadow-lg flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-xs font-medium">
                  Total Outgoing
                </span>
                <p className="text-lg sm:text-xl font-bold text-rose-400 mt-1">
                  {formatCurrency(summary.totalOutgoing)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
          </>
        )}
      </div>

      <PersonalTransactions />

        <AddPersonalExpense
        open={isTransactionOpen}
        onOpenChange={setIsTransactionOpen}
        />

        <AddCategory
        open={isCategoryOpen}
        onOpenChange={setIsCategoryOpen}
        />
    </div>
  );
}