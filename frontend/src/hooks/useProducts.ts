import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// Types
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    old_price?: number;
    rating: number;
    is_featured: boolean;
    is_popular: boolean;
    is_new: boolean;
    image_urls: string[];
    category_id: number;
    attributes: Record<string, any>;
}

export interface Category {
    id: number;
    name: string;
    image_url: string;
}

export interface ProductFilters {
    category_id?: number | null;
    gender?: string | null;
    sub_category?: string | null;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    order?: "asc" | "desc";
    search?: string;
}

export const useInfiniteProducts = (filters?: ProductFilters) => {
    return useInfiniteQuery({
        queryKey: ["products", filters],
        initialPageParam: 0,
        queryFn: async ({ pageParam = 0 }) => {
            const params = new URLSearchParams();
            if (filters?.category_id) params.append("category_id", filters.category_id.toString());
            if (filters?.gender) params.append("gender", filters.gender);
            if (filters?.sub_category) params.append("sub_category", filters.sub_category);
            if (filters?.min_price) params.append("min_price", filters.min_price.toString());
            if (filters?.max_price) params.append("max_price", filters.max_price.toString());
            if (filters?.sort_by) params.append("sort_by", filters.sort_by);
            if (filters?.order) params.append("order", filters.order);
            if (filters?.search) params.append("search", filters.search);

            // Pagination
            params.append("limit", "50");
            params.append("offset", (pageParam * 50).toString());

            const { data } = await api.get<Product[]>("/products", { params });
            return data;
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || lastPage.length === 0) return undefined;
            return lastPage.length === 50 ? allPages.length : undefined;
        },
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const { data } = await api.get<Product>(`/products/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get<Category[]>("/products/categories");
            return data;
        },
    });
};

export const useFeaturedProducts = (limit = 8) => {
    return useQuery({
        queryKey: ["products", "featured", limit],
        queryFn: async () => {
            const { data } = await api.get<Product[]>("/products/featured", { params: { limit } });
            return data;
        },
    });
};

export const usePopularProducts = (limit = 8) => {
    return useQuery({
        queryKey: ["products", "popular", limit],
        queryFn: async () => {
            const { data } = await api.get<Product[]>("/products/popular", { params: { limit } });
            return data;
        },
    });
};

export const useNewArrivals = (limit = 8) => {
    return useQuery({
        queryKey: ["products", "new-arrivals", limit],
        queryFn: async () => {
            const { data } = await api.get<Product[]>("/products/new-arrivals", { params: { limit } });
            return data;
        },
    });
};

export const useRecommendations = (id: number, limit = 6) => {
    return useQuery({
        queryKey: ["products", "recommendations", id, limit],
        queryFn: async () => {
            const { data } = await api.get<Product[]>(`/products/${id}/recommendations`, { params: { limit } });
            return data;
        },
        enabled: !!id,
    });
};
