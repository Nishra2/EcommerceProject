'use client';
import ShoppingCart from "@/components/ShoppingCart";
import React from 'react';


const CartPage: React.FC = () => {
    return (
        <div className="bg-blue-200 min-h-screen flex items-center justify-center">
            <ShoppingCart />
        </div>
    );
};

export default CartPage;