"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/layouts/loading/LoadingSpinner";

interface Product {
    id: number;
    title: string;
    price: string;
    category: string;
    description: string;
    image: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [limit, setLimit] = useState<number>(5); // Mặc định là 5 sản phẩm
    const [sortOrder, setSortOrder] = useState<string>("asc"); // Mặc định là sắp xếp tăng dần (asc)
    const [categories, setCategories] = useState<string[]>([]); // Danh sách các danh mục
    const [selectedCategory, setSelectedCategory] = useState<string>(""); // Danh mục đã chọn

    // Hàm lấy danh sách sản phẩm
    const fetchProducts = (
        limit: number,
        sortOrder: string,
        category: string
    ) => {
        setLoading(true);
        let url = `https://fakestoreapi.com/products?limit=${limit}&sort=${sortOrder}`;
        if (category) {
            url = `https://fakestoreapi.com/products/category/${category}?limit=${limit}&sort=${sortOrder}`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    };

    // Hàm lấy danh sách các danh mục
    const fetchCategories = () => {
        fetch("https://fakestoreapi.com/products/categories")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    };

    // Effect để lấy danh mục và sản phẩm
    useEffect(() => {
        fetchCategories();
        fetchProducts(limit, sortOrder, selectedCategory);
    }, [limit, sortOrder, selectedCategory]); // Khi limit, sortOrder hoặc selectedCategory thay đổi

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Products</h1>

            {/* Navbar cho các danh mục */}
            <div className="mb-4">
                <div className="flex space-x-4">
                    {/* Dropdown cho danh mục */}
                    <div className="flex items-center">
                        <label
                            htmlFor="category"
                            className="mr-2 font-semibold text-gray-700"
                        >
                            Filter by Category:
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="border rounded px-4 py-2"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown chọn số lượng sản phẩm */}
                    <div className="flex items-center">
                        <label
                            htmlFor="limit"
                            className="mr-2 font-semibold text-gray-700"
                        >
                            Show:
                        </label>
                        <select
                            id="limit"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="border rounded px-4 py-2"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    {/* Dropdown chọn thứ tự sắp xếp (Ascending/Descending) */}
                    <div className="flex items-center">
                        <label
                            htmlFor="sort"
                            className="mr-2 font-semibold text-gray-700"
                        >
                            Sort by Price:
                        </label>
                        <select
                            id="sort"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border rounded px-4 py-2"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden h-full"
                    >
                        <Link href={`/products/${product.id}`}>
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-64 object-cover cursor-pointer"
                            />
                        </Link>
                        <div className="p-4 h-[280px] overflow-hidden">
                            <h2 className="text-xl font-semibold text-gray-800 truncate">
                                {product.title}
                            </h2>
                            <p className="text-gray-600 text-sm truncate">
                                {product.category}
                            </p>
                            <p className="text-gray-800 mt-2 text-sm truncate">
                                {product.description}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-lg font-bold text-gray-900">
                                    ${product.price}
                                </span>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
