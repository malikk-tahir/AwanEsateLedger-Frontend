import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api-client";
import { useSelector } from "react-redux";

export const usePersonalTransactions = ({
  type = "",
  startDate = "",
  endDate = "",
  page = 1,
}) => {
  const { userData } = useSelector((state) => state.auth);

  const params = {};
  if (type) params.type = type;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (page) params.page = page;

  return useQuery({
    queryKey: ["personalTransactions", userData?._id, params],
    queryFn: async () => {
      const response = await api.get("/personaltransactions", { params });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
    enabled: !!userData?._id,
  });
};

export const useAddPersonalTransaction = () => {
  const { userData } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/personaltransactions", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Transaction added successfully");
      queryClient.invalidateQueries({
        queryKey: ["personalTransactions", userData?._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["personalTransactionSummary", userData?._id],
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to add transaction",
      );
    },
  });
};

export const usePersonalTransactionSummary = () => {
  const { userData } = useSelector((state) => state.auth);
  return useQuery({
    queryKey: ["personalTransactionSummary", userData?._id],
    queryFn: async () => {
      const response = await api.get("/personaltransactions/summary");
      return response.data;
    },
    enabled: !!userData?._id,
  });
};
