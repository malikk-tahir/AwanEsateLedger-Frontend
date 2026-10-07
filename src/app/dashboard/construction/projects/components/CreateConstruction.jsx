"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  constructionProjectSchema,
  PROJECT_STATUSES,
} from "@/schemas/constructionSchema";
import { useCreateProject } from "@/hooks/useConstruction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateForInput } from "@/lib/utils";
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

const CreateConstruction = ({ open, onOpenChange }) => {
  const form = useForm({
    resolver: zodResolver(constructionProjectSchema),
    defaultValues: {
      name: "",
      location: "",
      totalBudget: "",
      status: "in_progress",
      startDate: formatDateForInput(new Date()),
      expectedCompletionDate: "",
    },
  });

  const { mutate: createProject, isPending } = useCreateProject();

  const onSubmit = (data) => {
    createProject(data, {
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
      <AlertDialogContent className="bg-dark text-slate-100 border border-slate-800 w-[95vw] sm:w-full max-w-xl p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header - Fixed Top */}
        <AlertDialogHeader className="flex flex-row items-start justify-between pb-3 border-b border-slate-800/60 gap-2 shrink-0">
          <div className="space-y-1 pr-2">
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-white leading-tight">
              Create Construction Project
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Add a new construction site project to track budget and status.
            </AlertDialogDescription>
          </div>

          <AlertDialogCancel
            className="p-1.5 h-auto bg-transparent border-none text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg m-0 transition-colors shrink-0"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </AlertDialogCancel>
        </AlertDialogHeader>

        {/* Scrollable Form Body */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 overflow-y-auto pr-1 flex-1">
              {/* Project Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Project Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Commercial Plaza Site A"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Location *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Sector G-11, Islamabad"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Total Budget & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="totalBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-xs sm:text-sm">
                        Total Budget (PKR) *
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-xs sm:text-sm">
                        Status *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-slate-900/60 border-slate-700 text-white capitalize focus:ring-secondary-orange focus:ring-1 data-[placeholder]:text-slate-500 h-9 sm:h-10 text-xs sm:text-sm">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="bg-dark border border-slate-800 text-slate-200 shadow-xl z-50">
                          {PROJECT_STATUSES.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="capitalize cursor-pointer transition-colors focus:bg-secondary-orange focus:text-black hover:bg-secondary hover:text-black text-xs sm:text-sm"
                            >
                              {status.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Start Date & Expected Completion Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormDatePicker
                  control={form.control}
                  name="startDate"
                  label="Start Date"
                  required
                />

                <FormDatePicker
                  control={form.control}
                  name="expectedCompletionDate"
                  label="Expected Completion"
                  required
                />
              </div>
            </div>

            {/* Action Buttons - Fixed Bottom Footer */}
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
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateConstruction;