"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePersonalTransactions } from "@/hooks/usePersonalTransaction";
import { formatCurrency, formatDate, getDefaultDates } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { filterSchema } from "@/schemas/personalSchema";
import {FormDatePicker} from "@/components/ui/form-date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  Calendar,
  AlertCircle,
  Filter,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Tag,
  Search,
} from "lucide-react";


const PersonalTransactions = () => {
  const [page, setPage] = useState(1);
  const defaultDates = getDefaultDates();

  const [activeFilters, setActiveFilters] = useState({
    type: "",
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
  });

  const form = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      type: "all",
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    },
  });

  const { data: response, isLoading, isError, refetch } = usePersonalTransactions({
    type: activeFilters.type,
    startDate: activeFilters.startDate,
    endDate: activeFilters.endDate,
    page,
  });

  const transactions = response?.data || [];
  const totalPages = response?.totalPages || 1;
  const currentPage = response?.currentPage || 1;
  const totalRecords = response?.totalRecords || 0;

  const onSubmit = (values) => {
    setActiveFilters({
      type: values.type === "all" ? "" : values.type,
      startDate: values.startDate || "",
      endDate: values.endDate || "",
    });
    setPage(1);
  };

  const handleReset = () => {
    form.reset({
      type: "all",
      startDate: "",
      endDate: "",
    });
    setActiveFilters({
      type: "",
      startDate: "",
      endDate: "",
    });
    setPage(1);
  };

  const hasActiveFilters =
    activeFilters.type !== "" || activeFilters.startDate !== "" || activeFilters.endDate !== "";

  return (
    <div className="bg-dark border border-slate-800 p-4 sm:p-6 rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-secondary-orange shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            Personal Transactions
          </h2>
          <span className="text-[10px] sm:text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-0.5 rounded-full font-medium">
            {totalRecords} {totalRecords === 1 ? "entry" : "entries"}
          </span>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-dark border border-slate-800/80 p-3 sm:p-4 rounded-lg space-y-3"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Filter className="w-3.5 h-3.5 text-secondary-orange" />
              Filter Parameters
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] text-slate-400">Transaction Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-900/80 border-slate-800 text-white text-xs h-9 focus:ring-secondary-orange">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark border-slate-800 text-slate-200 text-xs">
                      <SelectItem value="all" className="focus:bg-slate-900 focus:text-white cursor-pointer">
                        All Types
                      </SelectItem>
                      <SelectItem value="incoming" className="focus:bg-slate-900 focus:text-white cursor-pointer">
                        Incoming
                      </SelectItem>
                      <SelectItem value="outgoing" className="focus:bg-slate-900 focus:text-white cursor-pointer">
                        Outgoing
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px] text-rose-400" />
                </FormItem>
              )}
            />

            <FormDatePicker
              control={form.control}
              name="startDate"
              label="Start Date"
            />

            <FormDatePicker
              control={form.control}
              name="endDate"
              label="End Date"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              size="sm"
              className="bg-secondary-orange hover:bg-secondary-orange/90 text-white text-xs h-8 px-4 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Apply Filters
            </Button>
          </div>
        </form>
      </Form>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-slate-900 rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-dark border border-slate-800 p-6 rounded-xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-red-400 text-sm font-medium">Failed to load transactions.</p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="border-slate-800">
            Try Again
          </Button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 space-y-2 border border-dashed border-slate-800/80 rounded-lg p-4">
          <Receipt className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-slate-300 text-sm font-medium">No transactions found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300 min-w-[600px]">
              <thead className="text-[11px] sm:text-xs uppercase bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-3 sm:px-4 py-3">Date</th>
                  <th className="px-3 sm:px-4 py-3">Type</th>
                  <th className="px-3 sm:px-4 py-3">Category</th>
                  <th className="px-3 sm:px-4 py-3">Description</th>
                  <th className="px-3 sm:px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((item) => {
                  const isIncoming = item.type === "incoming";
                  return (
                    <tr key={item._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-3 sm:px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatDate(item.date || item.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                            isIncoming
                              ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
                              : "bg-rose-950/50 text-rose-400 border border-rose-800/40"
                          }`}
                        >
                          {isIncoming ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {item.type}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3.5">
                        <span className="text-slate-200 capitalize font-medium flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-slate-500" />
                          {item.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3.5 text-slate-400 max-w-xs truncate">
                        {item.description || "-"}
                      </td>
                      <td className={`px-3 sm:px-4 py-3.5 text-right font-bold ${isIncoming ? "text-emerald-400" : "text-rose-400"}`}>
                        {isIncoming ? "+" : "-"}
                        {formatCurrency(item.amount)}
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
        </>
      )}
    </div>
  );
};

export default PersonalTransactions;