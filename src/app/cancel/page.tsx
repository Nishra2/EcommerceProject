'use client';
import React from 'react';

const CancelPage: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
            <p className="text-xl text-gray-700">Your payment was cancelled,
                click top left to return to the home page.
            </p>
        </div>
    );
};

export default CancelPage;