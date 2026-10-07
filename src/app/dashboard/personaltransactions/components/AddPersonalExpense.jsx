"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalTransactionSchema } from "@/schemas/personalSchema";
import { useAllPersonalCategories } from "@/hooks/usePersonalCategory";
import { useAddPersonalTransaction } from "@/hooks/usePersonalTransaction";
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
import { X, Loader2, Calendar } from "lucide-react";

const AddPersonalExpense = ({ open, onOpenChange }) => {
  const form = useForm({
    resolver: zodResolver(personalTransactionSchema),
    defaultValues: {
      type: "outgoing",
      amount: "",
      category: "",
      date: formatDateForInput(new Date()),
      description: "",
    },
  });

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useAllPersonalCategories();
  const { mutate: addTransaction, isPending } = useAddPersonalTransaction();

  const categories = categoriesData?.data || categoriesData || [];

  const onSubmit = (data) => {
    addTransaction(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-dark text-slate-100 border border-slate-800 w-[92vw] sm:w-full max-w-xl p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <AlertDialogHeader className="flex flex-row items-start justify-between pb-3 border-b border-slate-800/60 gap-2 shrink-0">
          <div className="space-y-1 pr-2 min-w-0">
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-white leading-tight">
              Add Personal Expense
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Record a new incoming or outgoing transaction to update your transaction history.
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
            className="flex flex-col flex-1 min-h-0 min-w-0"
          >
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 overflow-y-auto px-1.5 pb-1 flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel className="text-slate-200 text-xs sm:text-sm">
                        Type *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-slate-900/60 border-slate-700 text-white capitalize focus:ring-secondary-orange focus:ring-1 data-[placeholder]:text-slate-500 h-9 sm:h-10 text-xs sm:text-sm">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="bg-dark border border-slate-800 text-slate-200 shadow-xl z-50">
                          <SelectItem
                            value="incoming"
                            className="capitalize cursor-pointer transition-colors focus:bg-secondary-orange focus:text-black text-xs sm:text-sm"
                          >
                            Incoming
                          </SelectItem>
                          <SelectItem
                            value="outgoing"
                            className="capitalize cursor-pointer transition-colors focus:bg-secondary-orange focus:text-black text-xs sm:text-sm"
                          >
                            Outgoing
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel className="text-slate-200 text-xs sm:text-sm">
                        Amount (PKR) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g. 1500"
                          className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel className="text-slate-200 text-xs sm:text-sm">
                        Category *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-slate-900/60 border-slate-700 text-white capitalize focus:ring-secondary-orange focus:ring-1 data-[placeholder]:text-slate-500 h-9 sm:h-10 text-xs sm:text-sm">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="bg-dark border border-slate-800 text-slate-200 shadow-xl z-50">
                          {isLoadingCategories ? (
                            <div className="flex items-center justify-center p-3 text-xs text-slate-400">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Loading categories...
                            </div>
                          ) : categories.length === 0 ? (
                            <div className="p-3 text-xs text-slate-400 text-center">
                              No categories found
                            </div>
                          ) : (
                            categories.map((cat) => (
                              <SelectItem
                                key={cat._id || cat.id}
                                value={cat._id || cat.id}
                                className="capitalize cursor-pointer transition-colors focus:bg-secondary-orange focus:text-black hover:bg-secondary hover:text-black text-xs sm:text-sm"
                              >
                                {cat.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

<FormField
  control={form.control}
  name="date"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel className="text-slate-200 text-xs sm:text-sm">
        Date *
      </FormLabel>
      <FormControl>
        <div className="relative w-full">
          <Input
            type="date"
            onClick={(e) => {
              if (e.currentTarget.showPicker) {
                e.currentTarget.showPicker();
              }
            }}
            className="w-full bg-slate-900/60 border-slate-700 text-white focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange [color-scheme:dark] h-9 sm:h-10 text-xs sm:text-sm cursor-pointer appearance-none -webkit-appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer px-3 pr-9"
            {...field}
          />
          {/* Custom Calendar Icon position matching Shadcn/Tailwind style */}
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
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
                  <FormItem className="min-w-0">
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add optional notes or details..."
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange resize-none min-h-[70px] text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-slate-800/60 shrink-0 mt-4">
              <AlertDialogCancel
                className="w-full sm:flex-1 bg-transparent hover:bg-white text-slate-200 hover:text-black border border-slate-800 sm:border-none m-0 h-9 sm:h-10 text-xs sm:text-sm"
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
                    Adding...
                  </>
                ) : (
                  "Add Expense"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddPersonalExpense;