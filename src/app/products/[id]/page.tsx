"use client";

import React, { useEffect, useState } from "react";
// Thay đổi import router
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/layouts/loading/LoadingSpinner";

interface Product {
    id: number;
    title: string;
    price: string;
    category: string;
    description: string;
    image: string;
}

export default function ProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    // Sử dụng useParams thay vì router.query
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        if (id) {
            fetch(`https://fakestoreapi.com/products/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching product:", error);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">{product.title}</h1>
            <div className="flex gap-8">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-64 h-64 object-cover"
                />
                <div className="max-w-lg">
                    <p className="text-lg font-semibold text-gray-800">
                        Category: {product.category}
                    </p>
                    <p className="text-gray-700 mt-2">{product.description}</p>
                    <p className="text-xl font-bold text-gray-900 mt-4">
                        ${product.price}
                    </p>
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
