"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {PAYMENT_TYPES, paymentSchema} from "@/schemas/propertySchema";
import {useAddPaymentToProperty} from "@/hooks/useProperty"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {formatDateForInput} from "@/lib/utils"
import {FormDatePicker} from "@/components/ui/form-date-picker";
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

const AddPayment = ({ open, onOpenChange, propertyId}) => {
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      paymentType: "purchase_payment",
      note: "",
      date: formatDateForInput(new Date()),
    },
  });

  const { mutate: addPayment, isPending } = useAddPaymentToProperty();

  const onSubmit = (data) => {
      addPayment({propertyId, ...data }, 
        {
        onSuccess: () => {
          handleClose();
        },
      });
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-dark text-slate-100 border border-slate-800 w-[95vw] sm:w-full max-w-lg p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden">
        <AlertDialogHeader className="flex flex-row items-start justify-between pb-3 border-b border-slate-800/60 gap-2">
          <div className="space-y-1 pr-2">
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-white">
              Add Payment Transaction
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Record a purchase payment, sale receipt, or commission payment for this property.
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
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">
                    Amount (PKR) *
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

            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">
                    Payment Type *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-slate-900/60 border-slate-700 text-white focus:ring-secondary-orange focus:ring-1 data-[placeholder]:text-slate-500 h-9 sm:h-10 text-xs sm:text-sm">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark border border-slate-800 text-slate-200 shadow-xl z-50">
                      {PAYMENT_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="cursor-pointer transition-colors focus:bg-secondary-orange focus:text-black hover:bg-secondary hover:text-black text-xs sm:text-sm"
                        >
                          {type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <FormDatePicker
              control={form.control}
              name="date"
              label="Transaction Date"
              required
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">
                    Note / Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Initial token payment received via bank transfer"
                      className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange min-h-[80px] text-xs sm:text-sm resize-none"
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
                className="w-full sm:flex-1 bg-secondary-orange hover:bg-white text-black font-bold h-9 sm:h-10 text-xs sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  "Add Payment"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddPayment;