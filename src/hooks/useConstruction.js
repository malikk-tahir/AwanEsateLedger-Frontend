import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { toast } from "sonner";

export const useAllProjects = () => {
  return useQuery({
    queryKey: ["allProjects"],
    queryFn: async () => {
      const response = await api.get("/constructions");
      return response.data;
    },
  });
};

export const useProjectById = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await api.get(`/constructions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData) => {
      const response = await api.post("/constructions", projectData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Project Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed To Create Project");
    },
  });
};

// export const useUpdateProject = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ id, ...projectData }) => {
//       const response = await api.put(`/constructions/${id}`, projectData);
//       return response.data;
//     },
//     onSuccess: (data, variables) => {
//       toast.success(data?.message || "Project Updated Successfully");
//       queryClient.invalidateQueries({ queryKey: ["allProjects"] });
//       queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Failed To Update Project");
//     },
//   });
// };
