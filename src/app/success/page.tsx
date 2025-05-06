'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SuccessPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        // You can add logic here to clear the cart or show a success message
        console.log('Payment successful');
    }, []);

    return (
        <div className="flex flex-col justify-center items-center text-center h-96">
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase.</p>
        </div>
    );
};

export default SuccessPage;