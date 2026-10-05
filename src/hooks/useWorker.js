import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { toast } from "sonner";

export const useAllWorkers = () => {
  return useQuery({
    queryKey: ["allWorkers"],
    queryFn: async () => {
      const response = await api.get("/workers");
      return response.data;
    },
  });
};

export const useCreateWorker = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workerData) => {
      const response = await api.post("/workers", workerData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Worker Created Successfully");
      queryClient.invalidateQueries(["allWorkers"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed To Create Worker");
    },
  });
};

export const useUpdateWorker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...workerData }) => {
      const response = await api.put(`/workers/${id}`, workerData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Worker Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["allWorkers"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed To Update Worker");
    },
  });
};
