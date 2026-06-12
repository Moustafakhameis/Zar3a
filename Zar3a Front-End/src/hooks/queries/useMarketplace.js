import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceAPI } from '../../API/axiosInstance';

// Query keys
export const MARKETPLACE_KEYS = {
  allProducts: ['marketplace', 'all-products'],
  cropMarket: ['marketplace', 'crop-market'],
  agriShop: ['marketplace', 'agri-shop'],
  sensorMarket: ['marketplace', 'sensor-market'],
};

// Hooks

export const useAllProductsQuery = () => {
  return useQuery({
    queryKey: MARKETPLACE_KEYS.allProducts,
    queryFn: async () => {
      const [cropRes, agriRes, sensorRes] = await Promise.all([
        marketplaceAPI.getCropMarketProducts(),
        marketplaceAPI.getAgriShopProducts(),
        marketplaceAPI.getSensorMarketProducts().catch(() => ({ data: [] }))
      ]);

      const cropProducts = cropRes.data.products || cropRes.data || [];
      const agriProducts = agriRes.data.products || agriRes.data || [];
      const sensorProducts = sensorRes.data.products || sensorRes.data || [];

      return [...cropProducts, ...agriProducts, ...sensorProducts];
    },
  });
};

export const useCropMarketProductsQuery = () => {
  return useQuery({
    queryKey: MARKETPLACE_KEYS.cropMarket,
    queryFn: async () => {
      const { data } = await marketplaceAPI.getCropMarketProducts();
      return data.products || data || [];
    },
  });
};

export const useAgriShopProductsQuery = () => {
  return useQuery({
    queryKey: MARKETPLACE_KEYS.agriShop,
    queryFn: async () => {
      const { data } = await marketplaceAPI.getAgriShopProducts();
      return data.products || data || [];
    },
  });
};

export const useSensorMarketProductsQuery = () => {
  return useQuery({
    queryKey: MARKETPLACE_KEYS.sensorMarket,
    queryFn: async () => {
      const { data } = await marketplaceAPI.getSensorMarketProducts();
      return data.products || data || [];
    },
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData) => {
      let type = "CROP_MARKET";
      if (productData instanceof FormData) {
        type = productData.get("marketplaceType") || productData.get("type") || "CROP_MARKET";
      } else {
        type = productData.marketplaceType || productData.type || "CROP_MARKET";
      }

      let response;
      if (type === "AGRI_MARKET" || type === "agri") {
        response = await marketplaceAPI.createAgriShopProduct(productData);
      } else if (type === "SENSOR_MARKET" || type === "sensors") {
        response = await marketplaceAPI.createSensorMarketProduct(productData);
      } else {
        response = await marketplaceAPI.createCropMarketProduct(productData);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all related queries when a new product is created
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
  });
};
