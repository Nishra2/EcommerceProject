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
      <section className="bg-amber-300 py-20">
        <div className= "container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in-down">Explore Speed Merch's amazing products</h1>
          <p className="text-lg text-gray-700 mb-10 animate-fade-in-down delay-100">View current featured products below</p>
          <div className="w-full h-96">
              <div className="bg-amber-300 h-full w-full">
            <Carousel>
              {products.map((product) => (
                <div key={product.id} className="flex justify-center items-center">
                  {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} className="max-h-96 object-contain" />
                  ) : (
                      <img src="/not-found.jpg" alt={product.name} className="max-h-96 object-contain" />
                  )}
                </div>
              ))}
            </Carousel>
          </div>
        </div>
        </div>
      </section>

      {/* Search Product Section */}
      <section className="bg-blue-200 py-10">
        <SearchBar onSearch={handleSearch}
        
         />
      </section>

      {/* Category Filter Section */}
      <section className="py-5 rounded-full uppercase leading-tight shadow-mx cursor-pointer">
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
        />
      </section>

      {/* Product List Section */}
      <section className=" bg-blue-200 py-10">
        <ProductList searchTerm={searchTerm} selectedCategory={selectedCategory} />
      </section>
    </div>
  );
};

export default HomePage;