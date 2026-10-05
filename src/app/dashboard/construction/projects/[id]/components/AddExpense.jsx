"use client";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "@/schemas/expenseSchema";
import { useCreateExpense } from "@/hooks/useExpense"; 
import { useAllWorkers } from "@/hooks/useWorker"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDateForInput } from "@/lib/utils";
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

const AddExpense = ({ open, onOpenChange }) => {
  const params = useParams();
  const projectId = params.id;

  const { data: workersResponse, isLoading: isLoadingWorkers } = useAllWorkers();
  const workers = workersResponse?.data || [];

  const { mutate: createLedger, isPending } = useCreateExpense();

  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      workerId: "",
      contractAmount: 0,
      labourCost: 0,
      materialCost: 0,
      amountPaid: 0,
      description: "",
      date: formatDateForInput(new Date()),
    },
  });

  const onSubmit = (data) => {
    createLedger(
      { projectId, ...data },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-dark text-slate-100 border border-slate-800 w-[95vw] sm:w-full max-w-lg p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/60 gap-2">
          <div className="space-y-1">
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-white">
              Add Expense / Payment Entry
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs sm:text-sm">
              Record labor, material costs, and payments for this project.
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            
            <FormField
              control={form.control}
              name="workerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">Worker / Contractor *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-slate-900/60 border-slate-700 text-white capitalize focus:ring-secondary-orange focus:ring-1 data-[placeholder]:text-slate-500 text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue placeholder={isLoadingWorkers ? "Loading workers..." : "Select worker"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark border border-slate-800 text-slate-200 shadow-xl z-50">
                      {workers.map((worker) => (
                        <SelectItem
                          key={worker._id}
                          value={worker._id}
                          className="capitalize cursor-pointer transition-colors focus:bg-secondary-orange focus:text-black hover:bg-secondary-orange hover:text-black text-xs sm:text-sm"
                        >
                          {worker.name} ({worker.category || "Worker"})
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
                name="contractAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">Labour/Material Contract (PKR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange text-xs sm:text-sm h-9 sm:h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="labourCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">Labour Cost (PKR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange text-xs sm:text-sm h-9 sm:h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materialCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">Material Cost (PKR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange text-xs sm:text-sm h-9 sm:h-10"
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
                name="amountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">Amount Paid (PKR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange text-xs sm:text-sm h-9 sm:h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-900/60 border-slate-700 text-white focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange [color-scheme:dark] text-xs sm:text-sm h-9 sm:h-10"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">Description / Work Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Paid for 50 bags of cement and labor charges for 2nd floor plastering."
                      className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange resize-none h-20 text-xs sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-800/60">
              <AlertDialogCancel
                className="w-full sm:flex-1 bg-transparent hover:bg-white text-slate-200 hover:text-black border-none m-0 h-9 sm:h-10 text-xs sm:text-sm"
                onClick={handleClose}
              >
                Cancel
              </AlertDialogCancel>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:flex-1 bg-secondary-orange hover:bg-white text-black font-bold h-9 sm:h-10 disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Entry"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddExpense;