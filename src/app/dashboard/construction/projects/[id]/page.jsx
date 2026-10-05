"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useProjectById } from "@/hooks/useConstruction";
import StatusBadge from "../../../../../components/StatusBadge";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddExpense from "./components/AddExpense";
import ProjectExpense from "./components/ProjectExpense";
import ProjectSummary from "./components/ProjectSummary";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Wallet,
  TrendingDown,
  PiggyBank,
  Calendar,
  Clock,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

export default function SingleConstructionPage({ params }) {
  const { id } = use(params);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } = useProjectById(id);
  const project = response?.data;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <Skeleton className="h-10 w-32 bg-slate-800" />
        <Skeleton className="h-32 w-full bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 bg-slate-800 rounded-xl" />
          <Skeleton className="h-28 bg-slate-800 rounded-xl" />
          <Skeleton className="h-28 bg-slate-800 rounded-xl sm:col-span-2 md:col-span-1" />
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto text-center space-y-4 py-16">
        <p className="text-red-400">Failed to load construction project details.</p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="border-slate-700 text-dark"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  const totalBudget = project.totalBudget || 0;
  const totalSpent = project.totalSpent || 0;
  const remainingBudget = project.remainingBudget ?? (totalBudget - totalSpent);
  const spentPercentage = formatPercentage(totalBudget, totalSpent);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div>
        <Button
          asChild
          variant="ghost"
          className="text-dark hover:text-white hover:bg-dark p-2 h-auto font-medium"
        >
          <Link href="/dashboard/construction/projects" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
        </Button>
      </div>

      <div className="bg-dark/60 border border-slate-800 p-4 sm:p-6 rounded-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary-orange/10 border border-secondary-orange/20 flex items-center justify-center text-secondary-orange font-bold shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white break-words">{project.name}</h1>
              <p className="text-white text-xs sm:text-sm flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                {project.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
            <StatusBadge status={project.status} />
            <Button
              onClick={() => setIsExpenseOpen(true)}
              className="bg-secondary-orange hover:bg-amber-600 text-black font-semibold text-xs h-9 px-3.5 sm:px-4 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add Expense
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
            <span>Budget Utilization</span>
            <span className={spentPercentage > 90 ? "text-red-400" : "text-secondary-orange"}>
              {spentPercentage}% Used
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                spentPercentage > 90 ? "bg-red-500" : "bg-secondary-orange"
              }`}
              style={{ width: `${spentPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-dark/40 border border-slate-800 p-4 sm:p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-dark text-xs font-medium">
            <span>Total Allocated Budget</span>
            <Wallet className="w-4 h-4 text-blue-400 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white break-all">
            {formatCurrency(totalBudget)}
          </p>
        </div>

        <div className="bg-dark/40 border border-slate-800 p-4 sm:p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-dark text-xs font-medium">
            <span>Total Spent</span>
            <TrendingDown className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white break-all">
            {formatCurrency(totalSpent)}
          </p>
        </div>

        <div className="bg-dark/40 border border-slate-800 p-4 sm:p-5 rounded-xl space-y-2 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-dark text-xs font-medium">
            <span>Remaining Balance</span>
            <PiggyBank
              className={`w-4 h-4 shrink-0 ${
                remainingBudget < 0 ? "text-red-400" : "text-green-400"
              }`}
            />
          </div>
          <p
            className={`text-xl sm:text-2xl font-bold break-all ${
              remainingBudget < 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {formatCurrency(remainingBudget)}
          </p>
        </div>
      </div>

      <div className="bg-dark/40 border border-slate-800 p-4 sm:p-6 rounded-xl space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white">Project Schedule</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 bg-slate-900/50 p-3.5 sm:p-4 rounded-lg border border-slate-800/80">
            <Calendar className="w-5 h-5 text-secondary-orange shrink-0" />
            <div className="min-w-0">
              <p className="text-slate-400 text-xs">Start Date</p>
              <p className="text-white font-semibold text-xs sm:text-sm mt-0.5 truncate">
                {formatDate(project.startDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/50 p-3.5 sm:p-4 rounded-lg border border-slate-800/80">
            <Clock className="w-5 h-5 text-secondary-orange shrink-0" />
            <div className="min-w-0">
              <p className="text-slate-400 text-xs">Expected Completion</p>
              <p className="text-white font-semibold text-xs sm:text-sm mt-0.5 truncate">
                {formatDate(project.expectedCompletionDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddExpense open={isExpenseOpen} onOpenChange={setIsExpenseOpen}/>
      <ProjectSummary projectId={id}/>
      <ProjectExpense projectId={id}/>
    </div>
  );
}