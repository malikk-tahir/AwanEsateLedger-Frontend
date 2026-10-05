"use client";

import { useState } from "react";
import { useProjectExpense, useProjectExpenseWorkers } from "@/hooks/useExpense";
import WorkerSummary from "./WorkerSummary";
import { formatCurrency, formatDate } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  User,
  HardHat,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function ProjectExpense({ projectId }) {
  const [page, setPage] = useState(1);
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } = useProjectExpense(
    projectId,
    page
  );

  const { data: ExpenseWorkers = [] } = useProjectExpenseWorkers(projectId);

  const Expenses = response?.data || [];
  const totalPages = response?.totalPages || 1;
  const currentPage = response?.currentPage || 1;
  const totalCount = response?.totalCount || 0;

  if (isLoading) {
    return (
      <div className="bg-dark/40 border border-slate-800 p-4 sm:p-6 rounded-xl space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32 sm:w-40 bg-slate-800" />
          <Skeleton className="h-8 w-20 sm:w-24 bg-slate-800" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-slate-800/60 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-dark/40 border border-slate-800 p-6 sm:p-8 rounded-xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="text-red-400 text-sm font-medium">
          Failed to load expense ledger records.
        </p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="border-slate-700 text-dark hover:text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-dark/40 border border-slate-800 p-4 sm:p-6 rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-secondary-orange shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            Expense & Payment Records
          </h2>
          <span className="text-[10px] sm:text-xs bg-slate-800 text-slate-300 px-3 py-0.5 rounded-full font-medium">
            {totalCount} {totalCount === 1 ? "entry" : "entries"}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto flex-1">
          <Select
            value={selectedWorkerId}
            onValueChange={(value) => setSelectedWorkerId(value)}
          >
            <SelectTrigger className="w-full sm:w-72 bg-slate-800 border-slate-700 text-white text-xs h-9 focus:ring-dark capitalize">
              <SelectValue placeholder="Select Worker for Summary" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white text-xs">
              {ExpenseWorkers.map((worker) => (
                <SelectItem
                  key={worker._id}
                  value={worker._id}
                  className="focus:bg-slate-800 focus:text-white cursor-pointer capitalize"
                >
                  {worker.name} {worker.category ? `(${worker.category})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            disabled={!selectedWorkerId}
            onClick={() => setIsSummaryOpen(true)}
            size="sm"
            className="bg-secondary-orange hover:bg-secondary-orange/90 text-white text-xs w-full sm:w-auto shrink-0 transition-opacity disabled:opacity-50 h-9"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 shrink-0" />
            View Summary
          </Button>
        </div>
      </div>

      {Expenses.length === 0 ? (
        <div className="text-center py-8 sm:py-12 space-y-2 border border-dashed border-slate-800 rounded-lg p-4">
          <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600 mx-auto" />
          <p className="text-dark/80 text-sm font-medium">
            No expense or payment records logged yet.
          </p>
          <p className="text-dark text-xs">
            Click "Add Expense" above to record labor or material expenses.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300 min-w-[650px]">
              <thead className="text-[11px] sm:text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    Date
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    Worker / Vendor
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    Description
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                    Contract Amount
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                    Labour Cost
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                    Material Cost
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                    Total Cost
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                    Amount Paid
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                    Balance Owed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {Expenses.map((item) => {
                  const worker = item.workerId || {};
                  const labourCost = item.labourCost || 0;
                  const materialCost = item.materialCost || 0;
                  const amountPaid = item.amountPaid || 0;
                  const contractAmount = item.contractAmount || 0;

                  const totalCost = item.totalCost ?? labourCost + materialCost;
                  const balanceOwed = item.balanceOwed ?? totalCost - amountPaid;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-dark">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{formatDate(item.date || item.createdAt)}</span>
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white flex items-center gap-1.5 whitespace-nowrap">
                            <User className="w-3.5 h-3.5 text-secondary-orange shrink-0" />
                            {worker.name || "N/A"}
                          </span>
                          {worker.category && (
                            <span className="text-xs text-dark flex items-center gap-1 mt-0.5 capitalize whitespace-nowrap">
                              <HardHat className="w-3 h-3 text-slate-500" />
                              {worker.category}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3.5 max-w-[200px] truncate text-slate-300">
                        {item.description || "-"}
                      </td>

                      <td className="px-3 sm:px-4 py-3.5 text-right font-medium text-dark whitespace-nowrap">
                        {contractAmount > 0 ? formatCurrency(contractAmount) : "-"}
                      </td>

                      <td className="px-3 sm:px-4 py-3.5 text-right font-medium text-dark whitespace-nowrap">
                        {labourCost > 0 ? formatCurrency(labourCost) : "-"}
                      </td>

                      <td className="px-3 sm:px-4 py-3.5 text-right font-medium text-dark whitespace-nowrap">
                        {materialCost > 0 ? formatCurrency(materialCost) : "-"}
                      </td>

                      <td className="px-3 sm:px-4 py-3.5 text-right font-bold text-white whitespace-nowrap">
                        {formatCurrency(totalCost)}
                      </td>

                      <td className="px-3 sm:px-4 py-3.5 text-right font-semibold text-green-600 whitespace-nowrap">
                        {amountPaid > 0 ? formatCurrency(amountPaid) : "-"}
                      </td>

                      <td
                        className={`px-3 sm:px-4 py-3.5 text-right font-bold whitespace-nowrap ${
                          balanceOwed > 0 ? "text-red-600" : "text-dark"
                        }`}
                      >
                        {formatCurrency(balanceOwed)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />

          <WorkerSummary
            projectId={projectId}
            workerId={selectedWorkerId}
            open={isSummaryOpen}
            onOpenChange={setIsSummaryOpen}
          />
        </>
      )}
    </div>
  );
}