"use client";

import { use, useState } from "react";
import Link from "next/link";
import { usePropertyById } from "@/hooks/useProperty";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddPayment from "./components/AddPayment";
import EditProperty from "./components/EditProperty";
import {
  ArrowLeft,
  Home,
  MapPin,
  Tag,
  Maximize2,
  User,
  Phone,
  Wallet,
  TrendingDown,
  PiggyBank,
  RefreshCw,
  PlusCircle,
  Edit,
  ShieldCheck,
  Building,
  Percent,
  Receipt,
} from "lucide-react";
import PropertyPayments from "./components/PropertyPayments";

export default function SinglePropertyPage({ params }) {
  const { id } = use(params);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } = usePropertyById(id);
  const property = response?.data;

  // console.log(property);
  

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <Skeleton className="h-10 w-32 bg-slate-800" />
        <Skeleton className="h-64 w-full bg-slate-800 rounded-xl" />
        <Skeleton className="h-48 w-full bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto text-center space-y-4 py-16">
        <p className="text-red-400 text-sm">Failed to load property details.</p>
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

  const demandPrice = property.demandPrice || 0;
  const purchasePrice = property.purchasePrice || 0;
  const finalSellingPrice = property.finalSellingPrice || 0;
  const taxPercentage = property.taxPercentage || 0;
  const taxAmount = finalSellingPrice>0 ? (finalSellingPrice * taxPercentage) / 100 : (demandPrice * taxPercentage) / 100;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          className="text-dark hover:text-white hover:bg-dark p-2 h-auto font-medium text-xs sm:text-sm"
        >
          <Link href="/dashboard/properties" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Properties
          </Link>
        </Button>
      </div>

      <div className="bg-dark/60 border border-slate-800 p-4 sm:p-6 rounded-xl backdrop-blur-md space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-800/80">
          <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary-orange/10 border border-secondary-orange/20 flex items-center justify-center text-secondary-orange font-bold shrink-0">
              <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold text-white break-words">
                  {property.name}
                </h1>
                <StatusBadge status={property.status} />
              </div>
              <p className="text-white text-xs sm:text-sm flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>{property.location}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0">
            <Button
              onClick={() => setIsEditOpen(true)}
              variant="outline"
              className="border-slate-700 bg-slate-900/60 text-slate-200 hover:text-white hover:bg-slate-800 text-xs h-9 px-3 sm:px-4 flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-initial justify-center"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Property
            </Button>
            <Button
              onClick={() => setIsPaymentOpen(true)}
              className="bg-secondary-orange hover:bg-amber-600 text-black font-semibold text-xs h-9 px-3.5 sm:px-4 flex items-center gap-1.5 shrink-0 cursor-pointer flex-1 sm:flex-initial justify-center"
            >
              <PlusCircle className="w-4 h-4" /> Add Payment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-lg border border-slate-800/60">
            <h3 className="text-slate-200 font-semibold text-xs tracking-wider uppercase text-secondary-orange flex items-center gap-1.5">
              <Wallet className="w-4 h-4" /> Financial Breakdown
            </h3>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-500" /> Demand Price
                </span>
                <span className="text-white font-bold text-sm">
                  {formatCurrency(demandPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-slate-500" /> Tax ({taxPercentage}%)
                </span>
                <span className="text-amber-400 font-semibold">
                  {formatCurrency(taxAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-slate-500" /> Purchase Price
                </span>
                <span className="text-slate-200 font-semibold">
                  {purchasePrice ? formatCurrency(purchasePrice) : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <PiggyBank className="w-3.5 h-3.5 text-slate-500" /> Final Selling Price
                </span>
                <span className="text-emerald-400 font-bold">
                  {finalSellingPrice ? formatCurrency(finalSellingPrice) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-lg border border-slate-800/60">
            <h3 className="text-slate-200 font-semibold text-xs tracking-wider uppercase text-secondary-orange flex items-center gap-1.5">
              <Building className="w-4 h-4" /> Property Specifications
            </h3>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Type</span>
                <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-medium text-xs border border-slate-700/50">
                  {property.propertyType}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" /> Size
                </span>
                <span className="text-slate-200 font-medium">
                  {property.size || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Created Date</span>
                <span className="text-slate-200 font-medium">
                  {formatDate(property.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-lg border border-slate-800/60 md:col-span-2 lg:col-span-1">
            <h3 className="text-slate-200 font-semibold text-xs tracking-wider uppercase text-secondary-orange flex items-center gap-1.5">
              <User className="w-4 h-4" /> Ownership Info
            </h3>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Ownership Type</span>
                {property.isOwned ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Agency Owned
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">Third-Party Owned</span>
                )}
              </div>
              {!property.isOwned && (
                <>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" /> Owner Name
                    </span>
                    <span className="text-slate-200 font-medium truncate max-w-[150px]">
                      {property.ownerName || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> Contact
                    </span>
                    <span className="text-slate-200 font-medium truncate max-w-[150px]">
                      {property.ownerContact || "N/A"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddPayment
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        propertyId={id}
      />

      <EditProperty
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        property={property}
      />

      <PropertyPayments propertyId={id}/>
    </div>
  );
}