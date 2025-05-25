import { Product } from "@/models/product"; // import product model
import { create } from "zustand"; // zustand for state management


interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState { // define the cart state
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (product: Product) => void;
}

// Creating our cart store with zustand - this manages all cart data across the app
export const useCartStore = create<CartState>((set) => ({
    items: [],
    addItem: (product) =>
        set((state) => {
            const existingItem = state.items.find(
                (item) => item.product.id === product.id
            );
            if (existingItem) {
                return {
                    items: state.items.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                return { items: [...state.items, { product, quantity: 1 }] };
            }
        }),
    removeItem: (product) =>
        set((state) => {
            const updatedItems = state.items
                .map((item) => {
                    if (item.product.id === product.id) {
                        item.quantity -= 1;
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0);
            return { items: updatedItems };
        }),
}));
