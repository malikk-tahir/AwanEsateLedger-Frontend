"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

export function FormDatePicker({
  control,
  name,
  label,
  required = false,
  placeholder = "",
  className = "",
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && (
            <FormLabel className="text-slate-200 text-xs sm:text-sm">
              {label} {required && <span className="text-secondary-orange">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative w-full">
              <Input
                type="date"
                placeholder={placeholder}
                onClick={(e) => {
                  if (e.currentTarget.showPicker) {
                    e.currentTarget.showPicker();
                  }
                }}
                className={`w-full bg-slate-900/60 border-slate-700 text-white focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange [color-scheme:dark] h-9 sm:h-10 text-xs sm:text-sm cursor-pointer appearance-none -webkit-appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer px-3 pr-9 ${className}`}
                {...field}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormControl>
          <FormMessage className="text-red-400 text-xs" />
        </FormItem>
      )}
    />
  );
}