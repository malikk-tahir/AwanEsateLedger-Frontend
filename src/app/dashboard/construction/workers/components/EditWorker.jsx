"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workerFormSchema, WORKER_CATEGORIES } from "@/schemas/workerSchema";
import { useUpdateWorker } from "@/hooks/useWorker"; 
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";

const EditWorker = ({ open, onOpenChange, worker }) => {
  const form = useForm({
    resolver: zodResolver(workerFormSchema),
    defaultValues: {
      name: "",
      contact: "",
      category: "",
    },
  });

  const { mutate: updateWorker, isPending } = useUpdateWorker();

  useEffect(() => {
    if (worker) {
      form.reset({
        name: worker.name || "",
        contact: worker.contact || "",
        category: worker.category || "",
      });
    }
  }, [worker, form]);

  const onSubmit = (data) => {
    if (!worker) return;

    const workerId = worker._id || worker.id;

    updateWorker(
      { id: workerId, ...data },
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
      <AlertDialogContent className="bg-dark text-slate-100 border border-slate-800 w-[calc(100%-2rem)] max-w-md p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/60">
          <div className="pr-2">
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-white">
              Edit Worker
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs sm:text-sm">
              Update worker profile details in the system directory.
            </AlertDialogDescription>
          </div>

          <AlertDialogCancel
            className="p-1.5 h-auto bg-transparent border-none text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg m-0 transition-colors shrink-0 cursor-pointer"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">
                    Worker Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Ali Ahmed"
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
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">
                    Contact Number (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0300-1234567"
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">
                    Category *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-slate-900/60 border-slate-700 text-white capitalize focus:ring-secondary-orange focus:ring-1 data-[placeholder]:text-slate-500 text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue placeholder="Select worker trade" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="bg-dark border border-slate-800 text-slate-200 shadow-xl z-50">
                      {WORKER_CATEGORIES.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="capitalize cursor-pointer transition-colors focus:bg-secondary-orange focus:text-black hover:bg-secondary hover:text-black text-xs sm:text-sm"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 pt-5 sm:pt-6 border-t border-slate-800/60">
              <AlertDialogCancel
                className="w-full sm:w-auto sm:flex-1 bg-transparent hover:bg-white text-slate-200 hover:text-black border-none m-0 h-9 sm:h-10 cursor-pointer text-xs sm:text-sm"
                onClick={handleClose}
              >
                Cancel
              </AlertDialogCancel>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto sm:flex-1 bg-secondary-orange hover:bg-white text-black font-bold h-9 sm:h-10 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Updating...
                  </>
                ) : (
                  "Update Worker"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditWorker;