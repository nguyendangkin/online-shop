"use client";

import LoadingSpinner from "@/components/layouts/loading/LoadingSpinner";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Cart {
    id: number;
    userId: number;
    date: string;
    products: { productId: number; quantity: number }[];
}

export default function CartPage() {
    const router = useRouter();
    const [carts, setCarts] = useState<Cart[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [limit, setLimit] = useState<number>(5);
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const fetchCarts = (
        limit: number,
        sortOrder: string,
        startDate: string,
        endDate: string
    ) => {
        setLoading(true);
        let url = `https://fakestoreapi.com/carts?limit=${limit}&sort=${sortOrder}`;

        if (startDate) {
            url += `&startdate=${startDate}`;
        }
        if (endDate) {
            url += `&enddate=${endDate}`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setCarts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching carts:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCarts(limit, sortOrder, startDate, endDate);
    }, [limit, sortOrder, startDate, endDate]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                Shopping Carts
            </h1>

            {/* Controls Section */}
            <div className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                    <label
                        htmlFor="limit"
                        className="text-gray-700 font-medium mr-3"
                    >
                        Items per page:
                    </label>
                    <select
                        id="limit"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="border rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <label
                        htmlFor="sortOrder"
                        className="text-gray-700 font-medium mr-3"
                    >
                        Sort order:
                    </label>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="asc">Oldest First</option>
                        <option value="desc">Newest First</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <label
                            htmlFor="startDate"
                            className="text-gray-700 font-medium mr-3"
                        >
                            Start Date:
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center">
                        <label
                            htmlFor="endDate"
                            className="text-gray-700 font-medium mr-3"
                        >
                            End Date:
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Carts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carts.map((cart) => (
                    <div
                        key={cart.id}
                        onClick={() => router.push(`/carts/${cart.id}`)}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Cart #{cart.id}
                            </h2>
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                {new Date(cart.date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-600">
                                User ID:{" "}
                                <span className="font-medium text-gray-800">
                                    {cart.userId}
                                </span>
                            </p>
                            <p className="text-gray-600">
                                Items:{" "}
                                <span className="font-medium text-gray-800">
                                    {cart.products.length}
                                </span>
                            </p>
                        </div>
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Products:
                            </h3>
                            <ul className="space-y-2">
                                {cart.products.map((product, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                                    >
                                        Product #{product.productId} ×{" "}
                                        {product.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
