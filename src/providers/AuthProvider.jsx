"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { login, logout } from "@/store/authSlice";
import api from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const isLoginPage = pathname === "/login";
  
  

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/users/me");
        const userData = response.data?.user || response.data;

        if (userData && isMounted) {
          dispatch(login({ userData }));
          if (isLoginPage) {
            router.replace("/dashboard");
          }
        } else if (isMounted) {
          handleAuthFailure();
        }
      } catch (error) {
        if (isMounted) {
          // console.error(
          //   "Session expired or unauthenticated:",
          //   error?.response?.data?.message || error.message
          // );
          handleAuthFailure();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const handleAuthFailure = () => {
      dispatch(logout());
      if (!isLoginPage) {
        router.replace("/login");
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [dispatch, router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-3 text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-secondary-orange" />
        <p className="text-xs tracking-wide font-medium">Restoring session...</p>
      </div>
    );
  }

  return children;
}