'use client';
import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useRouter } from 'next/navigation';
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

const ShoppingCart: React.FC = () => {
    const { items, addItem, removeItem } = useCartStore();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async () => {
        
        setErrorMessage(null);
        
        if (items.length === 0) {
            setErrorMessage('Your cart is currently empty.');
            return;
        }
        
        try {
            setIsProcessing(true);
            
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
                setErrorMessage(`Checkout failed: ${message || 'Please try again'}`);
                setIsProcessing(false);
                return;
            }

            const { url } = await response.json();
            router.push(url);
        } catch (error) {
            setErrorMessage('Error during checkout. Please check your connection and try again.');
            setIsProcessing(false);
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
            <CardFooter className="flex flex-col items-start">
                <Button 
                    onClick={handleCheckout} 
                    disabled={isProcessing}
                    className="mb-2"
                >
                    {isProcessing ? 'Processing...' : 'Checkout'}
                </Button>
                
                {/* Error message display */}
                {errorMessage && (
                    <div className="text-red-500 text-sm mt-2">
                        {errorMessage}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default ShoppingCart;