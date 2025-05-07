'use client';

import React from 'react';
import { Order } from '@prisma/client';

interface OrderTableProps {
    order: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ order }) => {
    const renderLineItems = (lineItemsJson: any) => {
        try {
            const lineItems = JSON.parse(lineItemsJson);
            return (
                <ul className="list-disc pl-5">
                    {lineItems.map((item: any, index: number) => (
                        <li key={index}>
                            {item.description || item.name} 
                            {item.quantity > 1 ? ` (x${item.quantity})` : ''}
                        </li>
                    ))}
                </ul>
            );
        } catch (error) {
            return <span className="text-red-500">Error displaying items</span>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {order.map((item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                            <td className="px-6 py-4">
                                <div>{item.name || 'Guest'}</div>
                                <div className="text-sm text-gray-500">{item.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                {renderLineItems(item.lineItems)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                ${item.totalAmount.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderTable;