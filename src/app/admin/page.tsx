'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/models/product";
import { Order } from "@prisma/client";
import ProductForm from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";
import OrderTable from "@/components/OrderList";

const AdminPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        if ((session?.user as any)?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        
        fetchProducts();
        fetchOrders();
    }, [session, router]);

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (product: Product) => {
        try {
            const response = await fetch('/api/products', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: product.id }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setProducts(products.filter((p) => p.id !== product.id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleProductSubmit = async (product: Product) => {
        try {
            const method = product.id ? 'PUT' : 'POST';
            const response = await fetch('/api/products', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const updatedProduct = await response.json();
            if (method === 'POST') {
                setProducts([...products, updatedProduct]);
            } else {
                setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
            }
            setEditingProduct(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <div className="flex justify-end">
                    <button id="createProductButton" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                        setEditingProduct({
                            name: '',
                            description: '',
                            price: 0,
                            images: [],
                        });
                        setIsModalOpen(true);
                    }}>
                        Create Product
                    </button>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Products</h2>
                    <ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
                </div>
                
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Orders</h2>
                    <OrderTable order={orders} />
                </div>
            </CardContent>
            {isModalOpen && (
                <div id="productModal" className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {editingProduct?.id ? 'Edit Product' : 'Create New Product'}
                                </h3>
                                <ProductForm initialProduct={editingProduct} onSubmit={handleProductSubmit} />
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default AdminPage;