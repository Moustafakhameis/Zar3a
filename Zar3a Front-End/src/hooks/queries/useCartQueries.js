import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '../../API/axiosInstance';

export const CART_KEYS = {
  cart: ['cart'],
};

export const useCartQuery = (userId) => {
  return useQuery({
    queryKey: CART_KEYS.cart,
    queryFn: async () => {
      if (!userId) return { items: [] };
      const data = await cartAPI.getCart();
      return data || { items: [] };
    },
    enabled: !!userId, // Only fetch if the user is logged in
  });
};

export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items) => {
      const { data } = await cartAPI.updateCart(items);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: CART_KEYS.cart });
    },
  });
};
