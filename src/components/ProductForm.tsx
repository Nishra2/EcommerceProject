'use client';
import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import { Product } from "@/models/product";

interface ProductFormProps {
    initialProduct?: Product | null;
    onSubmit: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onSubmit }) => {
    const [name, setName] = useState(initialProduct?.name || '');
    const [description, setDescription] = useState(initialProduct?.description || '');
    const [price, setPrice] = useState(initialProduct?.price?.toString() || '');
    const [images, setImages] = useState<string[]>(initialProduct?.images || []);
    const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
    const [category, setCategory] = useState(initialProduct?.category || 'uncategorized');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        // Fetch categories when component mounts
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(['uncategorized', ...data]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        
        fetchCategories();
    }, []);

    const handleImageUpload = (uploadedImages: string[]) => {
        setImages([...images, ...uploadedImages]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const product = {
            id: initialProduct?.id,
            name,
            description,
            price: parseFloat(price),
            images: images,
            category,
            isFeatured: isFeatured,
        };
        onSubmit(product);
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Product Name"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Product Description"
                    required
                />
            </div>
            <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Product Price"
                    required
                />
            </div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Featured</label>
            </div>
            <ImageUploader onUpload={handleImageUpload} />
            {images.length > 0 && (
                <div className="mt-4">
                    <h4 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image Preview</h4>
                    <div className="flex overflow-x-auto space-x-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative w-32 h-32 m-2">
                                <img src={image} alt={`Product Image ${index + 1}`} className="object-cover w-full h-full" />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex justify-end">
                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    {'Save'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;