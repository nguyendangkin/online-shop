"use client";

import LoadingSpinner from "@/components/layouts/loading/LoadingSpinner";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Cart {
    id: number;
    userId: number;
    date: string;
    products: { productId: number; quantity: number }[];
}

export default function SingleCartPage() {
    const router = useRouter();
    const params = useParams();
    const cartId = params.id;
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCart = (id: string) => {
        setLoading(true);
        fetch(`https://fakestoreapi.com/carts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setCart(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching cart:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (cartId && typeof cartId === "string") {
            fetchCart(cartId);
        }
    }, [cartId]);

    if (loading) return <LoadingSpinner />;
    if (!cart) return <div>Cart not found.</div>;

    return (
        <div className="container mx-auto py-8 px-4">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Carts
            </button>

            <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Cart Details
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Viewing detailed information for Cart #{cart.id}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">
                            Cart Information
                        </h2>
                        <div className="space-y-2">
                            <p className="flex justify-between">
                                <span className="text-gray-600">Cart ID:</span>
                                <span className="font-medium">{cart.id}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">User ID:</span>
                                <span className="font-medium">
                                    {cart.userId}
                                </span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">
                                    {new Date(cart.date).toLocaleDateString()}
                                </span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">
                                    Total Items:
                                </span>
                                <span className="font-medium">
                                    {cart.products.length}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">
                            Total Summary
                        </h2>
                        <div className="space-y-2">
                            <p className="flex justify-between">
                                <span className="text-gray-600">
                                    Total Products:
                                </span>
                                <span className="font-medium">
                                    {cart.products.reduce(
                                        (sum, p) => sum + p.quantity,
                                        0
                                    )}
                                </span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">
                                    Unique Items:
                                </span>
                                <span className="font-medium">
                                    {cart.products.length}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Product List
                    </h2>
                    <div className="space-y-3">
                        {cart.products.map((product, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-800">
                                        Product #{product.productId}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Quantity: {product.quantity}
                                    </p>
                                </div>
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {product.quantity} units
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
