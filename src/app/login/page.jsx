"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/authSlice";
import api from "@/lib/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/users/login", data);
      if (response.data) {
        dispatch(login({ userData: response.data.user || response.data }));
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-3">
          <Image
            src="/awanestatelogo.png"
            alt="Awan Estate Logo"
            width={120}
            height={36}
            priority
            className="mx-auto h-10 w-auto object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">
              Management Portal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Sign in to manage projects, properties, and workforce.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="admin@awanestate.com"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200 text-xs sm:text-sm">
                    Password *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-secondary-orange focus-visible:ring-1 focus-visible:border-secondary-orange h-9 sm:h-10 text-xs sm:text-sm pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary-orange hover:bg-white text-black font-bold h-9 sm:h-10 text-xs sm:text-sm transition-all cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}