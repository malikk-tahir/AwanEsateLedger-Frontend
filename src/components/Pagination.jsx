"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-between pt-4 border-t border-slate-800/80 ${className}`}
    >
      <p className="text-xs text-white">
        Page <span className=" font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="h-8 px-2.5 border-slate-700 bg-slate-900/60 text-slate-300 hover:text-dark disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>

        <Button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="h-8 px-2.5 border-slate-700 bg-slate-900/60 text-slate-300 hover:text-dark disabled:opacity-40"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;