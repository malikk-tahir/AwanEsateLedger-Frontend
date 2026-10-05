"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSocietyById } from "@/hooks/useSociety";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EditSocietyProject from "./components/EditSocietyProject";
import AddInstallment from "./components/AddInstallement";
import SocietyInstallments from "./components/SocietyInstallements";
import {
  ArrowLeft,
  Building2,
  Tag,
  Maximize2,
  Wallet,
  Coins,
  RefreshCw,
  PlusCircle,
  Edit,
  Layers,
  FileText,
  Bookmark,
  TrendingUp,
  Hash,
} from "lucide-react";

export default function SingleSocietyProjectPage({ params }) {
  const { id } = use(params);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInstallementOpen, setIsInstallementOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useSocietyById(id);
  const project = response?.data;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <Skeleton className="h-10 w-32 bg-slate-800" />
        <Skeleton className="h-64 w-full bg-slate-800 rounded-xl" />
        <Skeleton className="h-48 w-full bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto text-center space-y-4 py-16">
        <p className="text-red-400 text-sm">
          Failed to load society project details.
        </p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          className="text-dark hover:text-white hover:bg-dark p-2 h-auto font-medium text-xs sm:text-sm"
        >
          <Link
            href="/dashboard/society"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Society Projects
          </Link>
        </Button>
      </div>

      <div className="bg-dark/60 border border-slate-800 p-4 sm:p-6 rounded-xl backdrop-blur-md space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-800/80">
          <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary-orange/10 border border-secondary-orange/20 flex items-center justify-center text-secondary-orange font-bold shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  {project.societyName}
                </h1>
                <StatusBadge status={project.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 text-xs sm:text-sm mt-1">
                <p className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>File / Plot No:</span>
                  <span className="text-slate-200 font-semibold">
                    {project.fileOrPlotNumber || "N/A"}
                  </span>
                </p>
                {project.registrationNumber && (
                  <p className="flex items-center gap-1.5 border-l border-slate-700/60 pl-4">
                    <Hash className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Reg No:</span>
                    <span className="text-slate-200 font-semibold">
                      {project.registrationNumber}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0">
            <Button
              onClick={() => setIsEditOpen(true)}
              variant="outline"
              className="border-slate-700 bg-slate-900/60 text-slate-200 hover:text-white hover:bg-slate-800 text-xs h-9 px-3 sm:px-4 flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-initial justify-center"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Project
            </Button>
            <Button
              onClick={() => setIsInstallementOpen(true)}
              className="bg-secondary-orange hover:bg-amber-600 text-black font-semibold text-xs h-9 px-3.5 sm:px-4 flex items-center gap-1.5 shrink-0 cursor-pointer flex-1 sm:flex-initial justify-center"
            >
              <PlusCircle className="w-4 h-4" /> Add Installment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          {/* Financial Details */}
          <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-lg border border-slate-800/60">
            <h3 className="text-secondary-orange font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Wallet className="w-4 h-4" /> Financial Details
            </h3>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-secondary-orange" /> Total Price
                </span>
                <span className="text-white font-bold text-sm">
                  {formatCurrency(project.totalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" /> Demand Price
                </span>
                <span className="text-slate-200 font-semibold">
                  {project.demandPrice ? formatCurrency(project.demandPrice) : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" /> Profit
                </span>
                <span className="text-emerald-400 font-semibold">
                  {project.profit ? formatCurrency(project.profit) : "PKR 0"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-slate-500" /> Down Payment Paid
                </span>
                <span className="text-slate-200 font-semibold">
                  {project.downPaymentPaid ? formatCurrency(project.downPaymentPaid) : "PKR 0"}
                </span>
              </div>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-lg border border-slate-800/60">
            <h3 className="font-semibold text-xs tracking-wider uppercase text-secondary-orange flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Property Specifications
            </h3>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-slate-500" /> Type
                </span>
                <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-medium text-xs border border-slate-700/50">
                  {project.type}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-500" /> Registration No.
                </span>
                <span className="text-slate-200 font-medium">
                  {project.registrationNumber || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" /> Size
                </span>
                <span className="text-slate-200 font-medium">
                  {project.size || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" /> Block / Sector
                </span>
                <span className="text-slate-200 font-medium">
                  {project.blockOrSector || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddInstallment
        open={isInstallementOpen}
        onOpenChange={setIsInstallementOpen}
        societyId={id}
      />

      <EditSocietyProject
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        societyProject={project}
      />

      <SocietyInstallments societyId={id} />
    </div>
  );
}