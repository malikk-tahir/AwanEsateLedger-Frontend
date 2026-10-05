import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { toast } from "sonner";

export const useAllSocieties = () => {
  return useQuery({
    queryKey: ["allSocieties"],
    queryFn: async () => {
      const response = await api.get("/societies");
      return response.data;
    },
  });
};

export const useSocietyById = (id) => {
  return useQuery({
    queryKey: ["society", id],
    queryFn: async () => {
      const response = await api.get(`/societies/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateSociety = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/societies", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Society Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["allSocieties"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed To Create Society");
    },
  });
};

export const useUpdateSociety = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.put(`/societies/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Society Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["allSocieties"] });
      queryClient.invalidateQueries({ queryKey: ["society", variables.id] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed To Update Society");
    },
  });
};

export const useSocietyInstallments = (societyId, page = 1) => {
  return useQuery({
    queryKey: ["societyInstallments", societyId, page],
    queryFn: async () => {
      const response = await api.get(
        `/installements/${societyId}?page=${page}`,
      );
      return response.data;
    },
    enabled: !!societyId,
  });
};

export const useAddInstallment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ societyId, ...data }) => {
      const response = await api.post(`/installements/${societyId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Installment Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["allSocieties"] });
      queryClient.invalidateQueries({
        queryKey: ["society", variables.societyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["societyInstallments", variables.societyId],
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed To Add Installment",
      );
    },
  });
};
