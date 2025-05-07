'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Product } from "@/models/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
  searchTerm: string;
  selectedCategory?: string;
}

const ProductList: React.FC<ProductListProps> = ({ searchTerm, selectedCategory = '' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products by both search term and category
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No products found matching your criteria.</p>
      )}
    </div>
  );
};

export default ProductList;