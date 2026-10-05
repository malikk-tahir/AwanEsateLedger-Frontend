"use client";

import { useState } from "react";
import { usePropertyPayments } from "@/hooks/useProperty";
import { formatCurrency, formatDate } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Calendar, AlertCircle, FileText, Tag } from "lucide-react";

export default function PropertyPayments({ propertyId }) {
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = usePropertyPayments(propertyId, page);

  const payments = response?.data || [];
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
          Failed to load property payment records.
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
          <CreditCard className="w-5 h-5 text-secondary-orange shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            Payment History
          </h2>
          <span className="text-[10px] sm:text-xs bg-slate-800 text-slate-300 px-3 py-0.5 rounded-full font-medium">
            {totalCount} {totalCount === 1 ? "entry" : "entries"}
          </span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8 sm:py-12 space-y-2 border border-dashed border-slate-800 rounded-lg p-4">
          <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600 mx-auto" />
          <p className="text-dark/80 text-sm font-medium">
            No payment records found.
          </p>
          <p className="text-dark text-xs">
            Log a new payment to start building transaction history.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300 min-w-[550px]">
              <thead className="text-[11px] sm:text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    Date
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    Payment Type
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 whitespace-nowrap">
                    Note / Remarks
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3 text-right whitespace-nowrap">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((item) => (
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

                    <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-white capitalize">
                        <Tag className="w-3.5 h-3.5 text-secondary-orange shrink-0" />
                        <span>
                          {item.paymentType?.replace("_", " ") || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 sm:px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-dark max-w-xs truncate">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{item.note || "-"}</span>
                      </div>
                    </td>

                    <td className="px-3 sm:px-4 py-3.5 text-right font-bold text-green-800 whitespace-nowrap">
                      {formatCurrency(item.amount || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}