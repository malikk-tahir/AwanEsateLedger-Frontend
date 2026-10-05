"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SOCIETY_PROJECT_TYPES,
  SOCIETY_PROJECT_STATUSES,
  societyProjectSchema,
} from "@/schemas/societySchema";
import { useUpdateSociety } from "@/hooks/useSociety";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { X, Loader2 } from "lucide-react";

const EditSocietyProject = ({ open, onOpenChange, societyProject }) => {
  const form = useForm({
    resolver: zodResolver(societyProjectSchema),
    defaultValues: {
      societyName: "",
      type: "file",
      registrationNumber: "",
      fileOrPlotNumber: "",
      blockOrSector: "",
      size: "",
      totalPrice: "",
      demandPrice: 0,
      profit: 0,
      downPaymentPaid: 0,
      status: "active_installment",
    },
  });

  const { mutate: updateSocietyProject, isPending } = useUpdateSociety();

  useEffect(() => {
    if (societyProject) {
      form.reset({
        societyName: societyProject.societyName || "",
        type: societyProject.type || "file",
        registrationNumber: societyProject.registrationNumber || "",
        fileOrPlotNumber: societyProject.fileOrPlotNumber || "",
        blockOrSector: societyProject.blockOrSector || "",
        size: societyProject.size || "",
        totalPrice: societyProject.totalPrice || "",
        demandPrice: societyProject.demandPrice || 0,
        profit: societyProject.profit || 0,
        downPaymentPaid: societyProject.downPaymentPaid || 0,
        status: societyProject.status || "active_installment",
      });
    }
  }, [societyProject, form]);

  const onSubmit = (data) => {
    const projectId = societyProject?._id || societyProject?.id;

    updateSocietyProject(
      { id: projectId, ...data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    if (societyProject) {
      form.reset({
        societyName: societyProject.societyName || "",
        type: societyProject.type || "file",
        registrationNumber: societyProject.registrationNumber || "",
        fileOrPlotNumber: societyProject.fileOrPlotNumber || "",
        blockOrSector: societyProject.blockOrSector || "",
        size: societyProject.size || "",
        totalPrice: societyProject.totalPrice || "",
        demandPrice: societyProject.demandPrice || 0,
        profit: societyProject.profit || 0,
        downPaymentPaid: societyProject.downPaymentPaid || 0,
        status: societyProject.status || "active_installment",
      });
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-dark text-slate-100 border border-slate-800 w-[95vw] sm:w-full max-w-2xl p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="flex flex-row items-start justify-between pb-3 border-b border-slate-800/60 gap-2">
          <div className="space-y-1 pr-2">
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-white">
              Edit Society Project
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Update details, pricing, and installment status for this society plot/file record.
            </AlertDialogDescription>
          </div>

          <AlertDialogCancel
            className="p-1.5 h-auto bg-transparent border-none text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg m-0 transition-colors shrink-0"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4 pt-3 sm:pt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="societyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Society Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Park View City"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Project Type *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-slate-900/60 border-slate-700 text-white capitalize focus:ring-secondary-orange focus:ring-1 data-[placeholder]:text-slate-500 h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-dark border border-slate-800 text-slate-200 shadow-xl z-50">
                        {SOCIETY_PROJECT_TYPES.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize cursor-pointer transition-colors focus:bg-secondary-orange focus:text-black hover:bg-secondary hover:text-black text-xs sm:text-sm"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Registration Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. REG-12345"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileOrPlotNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      File / Plot Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. F-104 or Plot #45"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="blockOrSector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Block / Sector
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Overseas Block B"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Size
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 7 Marla / 1 Kanal"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Status *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-slate-900/60 border-slate-700 text-white capitalize focus:ring-secondary-orange focus:ring-1 data-[placeholder]:text-slate-500 h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-dark border border-slate-800 text-slate-200 shadow-xl z-50">
                        {SOCIETY_PROJECT_STATUSES.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="capitalize cursor-pointer transition-colors focus:bg-secondary-orange focus:text-black hover:bg-secondary hover:text-black text-xs sm:text-sm"
                          >
                            {status.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Total Price (PKR) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 4500000"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="demandPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Demand Price (PKR)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 5000000"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Profit (PKR)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 500000"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="downPaymentPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">
                    Down Payment Paid (PKR)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 500000"
                      className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-slate-800/60">
              <AlertDialogCancel
                className="w-full sm:flex-1 bg-transparent hover:bg-white text-slate-200 hover:text-black border-none m-0 h-9 sm:h-10 text-xs sm:text-sm"
                onClick={handleClose}
              >
                Cancel
              </AlertDialogCancel>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:flex-1 bg-secondary-orange hover:bg-white text-black font-bold h-9 sm:h-10 text-xs sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSocietyProject;