"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/hooks/useProducts";
import { toast } from "sonner";

interface WishlistContextType {
    items: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<Product[]>([]);

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("fashion-fiesta-wishlist");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem("fashion-fiesta-wishlist", JSON.stringify(items));
    }, [items, isInitialized]);

    const addToWishlist = (product: Product) => {
        if (items.some(item => item.id === product.id)) {
            return;
        }

        toast.success("Added to wishlist");
        setItems(prev => [...prev, product]);
    };

    const removeFromWishlist = (productId: number) => {
        const exists = items.some(item => item.id === productId);
        if (exists) {
            toast.success("Removed from wishlist");
            setItems(prev => prev.filter(item => item.id !== productId));
        }
    };

    const isInWishlist = (productId: number) => {
        return items.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount: items.length }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
