'use client';
import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Product } from "@/models/product";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addItem } = useCartStore();

    const addToCart = (product: Product) => {
        addItem(product);
    };

    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/not-found.jpg';

    return (
        <div className="max-w-sm mb-2 pt-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-center items-center"data-testid="product-card">
            <a href="#">
                <img className="rounded-lg h-96 object-contain" src={imageUrl} alt={product.name} data-testid="product-image" />
            </a>
            <div className="p-5">
                <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center"data-testid="product-name">{product.name}</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-center"data-testid="product-description">{product.description}</p>
                <p className="mb-3 font-bold text-gray-700 dark:text-gray-400 text-center"data-testid="product-price">${product.price.toFixed(2)}</p>
                {product.category && (
                    <div className="mb-3 text-center">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"data-testid="product-category">
                            {product.category}
                        </span>
                    </div>
                )}
            </div>
            <button onClick={() => addToCart(product)} className="w-full text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"data-testid="add-to-cart-button">
                Add to cart
            </button>
        </div>
    );
};

export default ProductCard;