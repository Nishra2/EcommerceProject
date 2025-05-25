'use client';
import ShoppingCart from "@/components/ShoppingCart";
import React from 'react';


const CartPage: React.FC = () => {
    return (
        <div className="bg-blue-200 min-h-screen w-full flex items-center">
            <ShoppingCart />
        </div>
    );
};

export default CartPage;