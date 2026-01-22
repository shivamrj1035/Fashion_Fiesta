"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/hooks/useProducts";
import { toast } from "sonner";

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem("fashion-fiesta-cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem("fashion-fiesta-cart", JSON.stringify(items));
    }, [items, isInitialized]);

    const addToCart = (product: Product, quantity: number = 1) => {
        const existing = items.find(item => item.id === product.id);

        if (existing) {
            const newQuantity = existing.quantity + quantity;

            if (newQuantity <= 0) {
                removeFromCart(product.id);
                return;
            }

            toast.success(`Updated quantity in cart`);
            setItems(prev => prev.map(item =>
                item.id === product.id
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        } else {
            if (quantity <= 0) return; // Don't add with 0 or negative
            toast.success(`Added ${quantity} item(s) to cart`);
            setItems(prev => [...prev, { ...product, quantity }]);
        }
    };

    const removeFromCart = (productId: number) => {
        setItems(prev => prev.filter(item => item.id !== productId));
        toast.success("Removed from cart");
    };

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
