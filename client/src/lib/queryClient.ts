import { QueryClient } from "@tanstack/react-query";

// PWA Display Mode Detector 不需要复杂的API请求功能
// 仅保留基础的queryClient配置用于可能的扩展

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
