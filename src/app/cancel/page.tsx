'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
 
const CancelPage: React.FC = () => {
        const router = useRouter();
const handleReturnHome = () => {
        router.push('/');
    };
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
            <p className="text-xl text-gray-700">Your payment was cancelled
                
            </p>
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

export default CancelPage;