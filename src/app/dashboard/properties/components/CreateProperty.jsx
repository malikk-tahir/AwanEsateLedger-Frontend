"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PROPERTY_STATUSES, PROPERTY_TYPES, propertySchema } from "@/schemas/propertySchema";
import { useCreateProperty } from "@/hooks/useProperty"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const CreateProperty = ({ open, onOpenChange }) => {
  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      location: "",
      propertyType: "plot",
      status: "available",
      size: "",
      demandPrice: "",
      taxPercentage: 0,
      purchasePrice: 0,
      finalSellingPrice: 0,
      isOwned: false,
      ownerName: "",
      ownerContact: "",
    },
  });

  const { mutate: createProperty, isPending } = useCreateProperty();
  const watchIsOwned = form.watch("isOwned");

  const onSubmit = (data) => {
    createProperty(data, {
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
      <AlertDialogContent className="bg-dark text-slate-100 border border-slate-800 w-[95vw] sm:w-full max-w-2xl p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="flex flex-row items-start justify-between pb-3 border-b border-slate-800/60 gap-2">
          <div className="space-y-1 pr-2">
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-white">
              Create Property
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Add a new real estate property listing to manage sales and records.
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Property Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Blue World City Plot #12"
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Location *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Sector F-8, Islamabad"
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
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Property Type *
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
                        {PROPERTY_TYPES.map((type) => (
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">Status *</FormLabel>
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
                        {PROPERTY_STATUSES.map((status) => (
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="demandPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Demand Price (PKR) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 7500000"
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
                name="taxPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Tax Percentage (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 5"
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
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">Size</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 5 Marla / 1 Kanal"
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
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Purchase Price (PKR)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 6000000"
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
                name="finalSellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-xs sm:text-sm">
                      Final Selling Price (PKR)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 7200000"
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
              name="isOwned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-slate-800 p-3 sm:p-4 bg-slate-900/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-slate-600 data-[state=checked]:bg-secondary-orange data-[state=checked]:text-black mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-slate-200 text-xs sm:text-sm cursor-pointer">
                      Directly Owned Property
                    </FormLabel>
                    <p className="text-[11px] sm:text-xs text-slate-400">
                      Check if this property is agency/company owned rather than a third-party listing.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {!watchIsOwned && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-xs sm:text-sm">
                        Owner Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Malik Ahmad"
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
                  name="ownerContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-xs sm:text-sm">
                        Owner Contact
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. +92 300 1234567"
                          className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
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
                    Creating...
                  </>
                ) : (
                  "Create Property"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateProperty;