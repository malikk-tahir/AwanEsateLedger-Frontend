import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { toast } from "sonner";

export const useProjectExpense = (projectId, page = 1) => {
  return useQuery({
    queryKey: ["projectExpenses", projectId, page],
    queryFn: async () => {
      const response = await api.get(
        `/construction-ledgers/project/${projectId}?page=${page}`,
      );
      return response.data;
    },
    enabled: !!projectId,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, ...ledgerData }) => {
      const response = await api.post(
        `/construction-ledgers/project/${projectId}`,
        ledgerData,
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Ledger Entry Added Successfully");

      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projectExpenses", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projectExpenseWorkers", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projectSummary", variables.projectId],
      });

      if (variables.workerId) {
        queryClient.invalidateQueries({
          queryKey: ["workerSummary", variables.projectId, variables.workerId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["workerSummary", variables.projectId],
        });
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed To Add Ledger Entry",
      );
    },
  });
};

export const useWorkerSummary = (projectId, workerId) => {
  return useQuery({
    queryKey: ["workerSummary", projectId, workerId],
    queryFn: async () => {
      const response = await api.get(
        `/construction-ledgers/worker-summary/project/${projectId}/worker/${workerId}`,
      );
      return response.data;
    },
    enabled: Boolean(projectId && workerId),
  });
};

export const useProjectExpenseWorkers = (projectId) => {
  return useQuery({
    queryKey: ["projectExpenseWorkers", projectId],
    queryFn: async () => {
      const response = await api.get(
        `/construction-ledgers/projects/${projectId}/workers`,
      );
      return response.data?.data;
    },
    enabled: Boolean(projectId),
  });
};

export const useProjectSummary = (projectId) => {
  return useQuery({
    queryKey: ["projectSummary", projectId],
    queryFn: async () => {
      const response = await api.get(
        `/construction-ledgers/project-summary/${projectId}`,
      );
      return response.data?.data;
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
};
