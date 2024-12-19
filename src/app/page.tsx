"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/layouts/loading/LoadingSpinner";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

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

    // Lấy dữ liệu từ API khi component mount
    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">All Products</h1>
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
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
