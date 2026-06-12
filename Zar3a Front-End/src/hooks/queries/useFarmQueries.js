import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmsAPI } from '../../API/axiosInstance';
import { toast } from 'sonner';

export const useGetFarms = () => {
  return useQuery({
    queryKey: ['farms'],
    queryFn: async () => {
      const response = await farmsAPI.getFarms();
      return response.data;
    },
  });
};

export const useCreateFarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await farmsAPI.createFarm(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success('Farm created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create farm');
    },
  });
};

export const useDeleteFarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farmId) => {
      const response = await farmsAPI.deleteFarm(farmId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success('Farm deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete farm');
    },
  });
};

export const useCreateSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ farmId, data }) => {
      const response = await farmsAPI.createSector(farmId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success('Sector created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create sector');
    },
  });
};

export const useDeleteSector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sectorId) => {
      const response = await farmsAPI.deleteSector(sectorId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success('Sector deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete sector');
    },
  });
};
