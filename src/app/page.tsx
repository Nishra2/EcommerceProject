'use client';
import React, { useState, useEffect } from 'react';
import { Carousel } from 'flowbite-react';
import { Product } from "@/models/product";
import ProductList from "@/components/ProductList";
import CategoryFilter from "@/components/CategoryFilter";

const SearchBar: React.FC<{ onSearch: (term: string) => void }> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="container mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 animate-slide-in-left">Search Products</h2>
      <input
        type="text"
        placeholder="Enter product name"
        className="border p-3 rounded w-full md:w-1/2 animate-slide-in-right"
        value={searchTerm}
        onChange={handleSearchChange}
          data-testid="search-input"
      />
    </div>
  );
};

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState<Array<Product>>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products?isFeatured=true');
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in-down">Catch Our Amazing Collection</h1>
          <p className="text-lg text-gray-700 mb-10 animate-fade-in-down delay-100">Explore a wide range of high-quality products.</p>
          <div className="w-full h-96">
            <Carousel>
              {products.map((product) => (
                <div key={product.id} className="flex justify-center items-center">
                  {product.images && product.images.length > 0 ? (
                    <a href={`/products/${product.id}`}>
                      <img src={product.images[0]} alt={product.name} className="max-h-96 object-contain" />
                    </a>
                  ) : (
                    <a href={`/products/${product.id}`}>
                      <img src="/not-found.jpg" alt={product.name} className="max-h-96 object-contain" />
                    </a>
                  )}
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Search Product Section */}
      <section className="py-10">
        <SearchBar onSearch={handleSearch}
        
         />
      </section>

      {/* Category Filter Section */}
      <section className="py-5">
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
        />
      </section>

      {/* Product List Section */}
      <section className="py-10">
        <ProductList searchTerm={searchTerm} selectedCategory={selectedCategory} />
      </section>
    </div>
  );
};

export default HomePage;