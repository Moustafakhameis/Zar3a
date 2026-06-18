import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { adminAPI } from "../../API/axiosInstance";
import { toast } from "sonner";

// Queries
export const useAdminStats = (isAdmin) => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data.stats || data;
    },
    refetchInterval: 30000, // Background polling every 30s
    enabled: !!isAdmin,
  });
};

export const useAllUsers = (params = { limit: 50 }, isAdmin) => {
  return useQuery({
    queryKey: ['allUsers', params],
    queryFn: async () => {
      const { data } = await api.get('/admin/users', { params });
      return data.users || [];
    },
    enabled: !!isAdmin,
  });
};

export const usePendingUsers = (isAdmin) => {
  return useQuery({
    queryKey: ['pendingUsers'],
    queryFn: async () => {
      const { data } = await api.get('/auth/admin/pending-users');
      return data || [];
    },
    enabled: !!isAdmin,
  });
};

export const usePendingInquiries = (isAdmin) => {
  return useQuery({
    queryKey: ['pendingInquiries'],
    queryFn: async () => {
      const response = await adminAPI.getInquiries();
      const inquiries = response?.data?.inquiries || [];
      return inquiries.filter(i => i.status === 'PENDING');
    },
    enabled: !!isAdmin,
  });
};

// Mutations
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const { data } = await api.post(`/admin/users/${userId}/role`, { newRole });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      toast.success("User role updated successfully.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to change user role.");
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.delete(`/admin/users/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      toast.success("User deleted successfully.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete user.");
    }
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.post(`/auth/admin/approve-user/${userId}`);
      return data;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['pendingUsers'] });
      const previousPendingUsers = queryClient.getQueryData(['pendingUsers']);
      
      queryClient.setQueryData(['pendingUsers'], (old) => {
        // Optimistically remove or update the user
        // Note: For pending_sensor, the backend sets status to pending_sensor, but we just remove them from 'pending' list in UI or update their status.
        return old ? old.map(u => u.id === userId ? { ...u, status: 'pending_sensor' } : u) : [];
      });
      
      return { previousPendingUsers };
    },
    onSuccess: () => {
      toast.success("User approved successfully.");
    },
    onError: (err, userId, context) => {
      if (context?.previousPendingUsers) {
        queryClient.setQueryData(['pendingUsers'], context.previousPendingUsers);
      }
      toast.error(err?.response?.data?.message || "Failed to approve user.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    }
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.post(`/auth/admin/reject-user/${userId}`);
      return data;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['pendingUsers'] });
      const previousPendingUsers = queryClient.getQueryData(['pendingUsers']);
      
      queryClient.setQueryData(['pendingUsers'], (old) => {
        return old ? old.filter(u => u.id !== userId) : [];
      });
      
      return { previousPendingUsers };
    },
    onSuccess: () => {
      toast.success("User request rejected successfully.");
    },
    onError: (err, userId, context) => {
      if (context?.previousPendingUsers) {
        queryClient.setQueryData(['pendingUsers'], context.previousPendingUsers);
      }
      toast.error(err?.response?.data?.message || "Failed to reject user.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    }
  });
};

export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await adminAPI.updateInquiryStatus(id, status);
      return data;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['pendingInquiries'] });
      const previousInquiries = queryClient.getQueryData(['pendingInquiries']);
      
      queryClient.setQueryData(['pendingInquiries'], (old) => {
        return old ? old.filter(i => i.id !== id) : [];
      });
      
      return { previousInquiries };
    },
    onSuccess: (_, variables) => {
      toast.success(`Inquiry ${variables.status.toLowerCase()} successfully.`);
    },
    onError: (err, variables, context) => {
      if (context?.previousInquiries) {
        queryClient.setQueryData(['pendingInquiries'], context.previousInquiries);
      }
      toast.error(err?.response?.data?.message || "Failed to update inquiry.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingInquiries'] });
    }
  });
};
