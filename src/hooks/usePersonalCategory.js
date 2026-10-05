import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api-client";
import { useSelector } from "react-redux";

export const useAllPersonalCategories = () => {
  const { userData } = useSelector((state) => state.auth);

  return useQuery({
    queryKey: ["personalCategories", userData?._id],
    queryFn: async () => {
      const response = await api.get("/personalcategories");
      return response.data;
    },
    enabled: !!userData?._id,
  });
};

export const useAddPersonalCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/personalcategories", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Category added successfully");
      queryClient.invalidateQueries({ queryKey: ["personalCategories"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add category");
    },
  });
};
