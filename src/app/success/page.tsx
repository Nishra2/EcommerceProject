'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const SuccessPage: React.FC = () => {
    const router = useRouter();

    const handleReturnHome = () => {
        router.push('/');
    };

    useEffect(() => {
        // You can add logic here to clear the cart or show a success message
        console.log('Payment successful');
    }, []);

    return (
        <div className="flex flex-col justify-center items-center text-center h-96">
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase.</p>

            <Button 
                            className='bg-red-500 hover:bg-red-600 text-white mt-6'
                                variant="outline" 
                                onClick={handleReturnHome}
                            >
                                Return to Home
                            </Button>
        </div>
        
    );
};

export default SuccessPage;