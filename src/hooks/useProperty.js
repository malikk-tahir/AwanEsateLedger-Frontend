import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { toast } from "sonner";

export const useAllProperties = () => {
  return useQuery({
    queryKey: ["allProperties"],
    queryFn: async () => {
      const response = await api.get("/properties");
      return response.data;
    },
  });
};

export const usePropertyById = (id) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyData) => {
      const response = await api.post("/properties", propertyData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Property Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed To Create Property",
      );
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.put(`/properties/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Property Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
      queryClient.invalidateQueries({ queryKey: ["property", variables.id] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed To Update Property",
      );
    },
  });
};

export const usePropertyPayments = (propertyId, page = 1) => {
  return useQuery({
    queryKey: ["propertyPayments", propertyId, page],
    queryFn: async () => {
      const response = await api.get(`/payments/${propertyId}?page=${page}`);
      return response.data;
    },
    enabled: !!propertyId,
  });
};

export const useAddPaymentToProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, ...data }) => {
      const response = await api.post(`/payments/${propertyId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Payment Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["allProperties"] });
      queryClient.invalidateQueries({
        queryKey: ["property", variables.propertyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["propertyPayments", variables.propertyId],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed To Add Payment");
    },
  });
};
