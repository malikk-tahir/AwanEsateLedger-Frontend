"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalCategorySchema } from "@/schemas/personalSchema";
import { useAddPersonalCategory } from "@/hooks/usePersonalCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { X, Loader2 } from "lucide-react";

const AddCategory = ({ open, onOpenChange }) => {
  const form = useForm({
    resolver: zodResolver(personalCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: addCategory, isPending } = useAddPersonalCategory();

  const onSubmit = (data) => {
    addCategory(data, {
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
      <AlertDialogContent className="bg-dark text-slate-100 border border-slate-800 w-[95vw] sm:w-full max-w-md p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <AlertDialogHeader className="flex flex-row items-start justify-between pb-3 border-b border-slate-800/60 gap-2 shrink-0">
          <div className="space-y-1 pr-2">
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-white leading-tight">
              Add Personal Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Create a new category to group your incoming and outgoing transactions.
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
            className="flex flex-col flex-1"
          >
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Category Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Office Expenses, Groceries, Medical"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
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
                  "Add Category"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddCategory;