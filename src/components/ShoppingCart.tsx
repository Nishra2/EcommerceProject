'use client';
import React from 'react';
import { useCartStore } from '../store/cartStore';
import { useRouter } from 'next/navigation';
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

const ShoppingCart: React.FC = () => {
    const { items, addItem, removeItem } = useCartStore();
    const router = useRouter();

    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems: items.map((item) => ({
                        ...item.product,
                        quantity: item.quantity,
                    })),
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                console.error('Checkout failed:', message);
                return;
            }

            const { url } = await response.json();
            router.push(url);
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul>
                        {items.map((item) => (
                            <li key={item.product.id} className="flex items-center justify-between py-2">
                                <span>
                                    {item.product.name} - Quantity: {item.quantity}
                                </span>
                                <div>
                                    <Button size="sm" onClick={() => addItem(item.product)}>+</Button>
                                    <Button size="sm" variant="destructive" onClick={() => removeItem(item.product)}>-</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleCheckout}>Checkout</Button>
            </CardFooter>
        </Card>
    );
};

export default ShoppingCart;