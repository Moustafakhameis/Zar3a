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
    // Background polling for real-time telemetry updates
    refetchInterval: 5000, 
    refetchOnWindowFocus: true,
  });
};

export const useCreateFarm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await farmsAPI.createFarm(data);
      return response.data;
    },
    onMutate: async (newFarmData) => {
      await queryClient.cancelQueries({ queryKey: ['farms'] });
      const previousFarms = queryClient.getQueryData(['farms']);
      
      queryClient.setQueryData(['farms'], (old) => {
        const optimisticFarm = { 
          id: `temp-${Date.now()}`, 
          name: newFarmData.name, 
          Sectors: [] 
        };
        return old ? [...old, optimisticFarm] : [optimisticFarm];
      });
      
      return { previousFarms };
    },
    onError: (error, newFarmData, context) => {
      if (context?.previousFarms) {
        queryClient.setQueryData(['farms'], context.previousFarms);
      }
      toast.error(error.response?.data?.error || 'Failed to create farm');
    },
    onSuccess: () => {
      toast.success('Farm created successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
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
    onMutate: async (farmId) => {
      await queryClient.cancelQueries({ queryKey: ['farms'] });
      const previousFarms = queryClient.getQueryData(['farms']);
      
      queryClient.setQueryData(['farms'], (old) => {
        return old ? old.filter((farm) => farm.id !== farmId) : [];
      });
      
      return { previousFarms };
    },
    onError: (error, farmId, context) => {
      if (context?.previousFarms) {
        queryClient.setQueryData(['farms'], context.previousFarms);
      }
      toast.error(error.response?.data?.error || 'Failed to delete farm');
    },
    onSuccess: () => {
      toast.success('Farm deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
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
    onMutate: async ({ farmId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['farms'] });
      const previousFarms = queryClient.getQueryData(['farms']);
      
      queryClient.setQueryData(['farms'], (old) => {
        if (!old) return old;
        return old.map(farm => {
          if (farm.id === farmId) {
            const optimisticSector = { id: `temp-sec-${Date.now()}`, ...data };
            return { ...farm, Sectors: [...(farm.Sectors || []), optimisticSector] };
          }
          return farm;
        });
      });
      
      return { previousFarms };
    },
    onError: (error, variables, context) => {
      if (context?.previousFarms) {
        queryClient.setQueryData(['farms'], context.previousFarms);
      }
      toast.error(error.response?.data?.error || 'Failed to create sector');
    },
    onSuccess: () => {
      toast.success('Sector created successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
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
    onMutate: async (sectorId) => {
      await queryClient.cancelQueries({ queryKey: ['farms'] });
      const previousFarms = queryClient.getQueryData(['farms']);
      
      queryClient.setQueryData(['farms'], (old) => {
        if (!old) return old;
        return old.map(farm => ({
          ...farm,
          Sectors: farm.Sectors ? farm.Sectors.filter(sec => sec.id !== sectorId) : []
        }));
      });
      
      return { previousFarms };
    },
    onError: (error, sectorId, context) => {
      if (context?.previousFarms) {
        queryClient.setQueryData(['farms'], context.previousFarms);
      }
      toast.error(error.response?.data?.error || 'Failed to delete sector');
    },
    onSuccess: () => {
      toast.success('Sector deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
    },
  });
};
