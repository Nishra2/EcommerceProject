'use client';
import React from 'react';

import { Product } from "@/models/product";
import { Button } from "./ui/button";


interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto" data-testid="product-table-container">
            <table className="min-w-full divide-y divide-gray-200" data-testid="product-table">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} data-testid={`product-row-${product.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap" data-testid={`product-name-cell-${product.id}`}>{product.name.substring(0, 50)}</td>
                            <td className="px-6 py-4 whitespace-nowrap" data-testid={`product-description-cell-${product.id}`}>{product.description.substring(0, 100)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap" data-testid={`product-price-cell-${product.id}`}>${product.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap" data-testid={`product-actions-${product.id}`}>
                                <Button size="sm" onClick={() => onEdit(product)} data-testid={`edit-product-${product.id}`}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => onDelete(product)} data-testid={`delete-product-${product.id}`}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
