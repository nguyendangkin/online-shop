"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Product {
    productId: string;
    quantity: string;
}

interface Cart {
    id?: number;
    userId: number;
    date: string;
    products: {
        productId: number;
        quantity: number;
    }[];
}

interface FeedbackState {
    message: string;
    isError: boolean;
}

interface ApiResponse extends Cart {
    id: number;
}

export default function CartManager() {
    const [userId, setUserId] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([
        { productId: "", quantity: "" },
    ]);
    const [feedback, setFeedback] = useState<FeedbackState>({
        message: "",
        isError: false,
    });
    const [cartId, setCartId] = useState<string>("");

    const handleAddProduct = (): void => {
        setProducts([...products, { productId: "", quantity: "" }]);
    };

    const handleRemoveProduct = (index: number): void => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    const handleProductChange = (
        index: number,
        field: keyof Product,
        value: string
    ): void => {
        const newProducts = [...products];
        newProducts[index][field] = value;
        setProducts(newProducts);
    };

    const createCartPayload = (): Cart => ({
        userId: parseInt(userId),
        date: new Date().toISOString().split("T")[0],
        products: products.map((p) => ({
            productId: parseInt(p.productId),
            quantity: parseInt(p.quantity),
        })),
    });

    const handleSubmit = async (): Promise<void> => {
        try {
            const response = await fetch("https://fakestoreapi.com/carts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createCartPayload()),
            });
            const data: ApiResponse = await response.json();
            setFeedback({
                message: `Cart created with ID: ${data.id}`,
                isError: false,
            });
        } catch (error) {
            setFeedback({
                message: `Error creating cart: ${(error as Error).message}`,
                isError: true,
            });
        }
    };

    const handleUpdate = async (): Promise<void> => {
        if (!cartId) {
            setFeedback({
                message: "Cart ID is required for update",
                isError: true,
            });
            return;
        }

        try {
            const response = await fetch(
                `https://fakestoreapi.com/carts/${cartId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(createCartPayload()),
                }
            );
            const data: ApiResponse = await response.json();
            setFeedback({
                message: `Cart updated: ${data.id}`,
                isError: false,
            });
        } catch (error) {
            setFeedback({
                message: `Error updating cart: ${(error as Error).message}`,
                isError: true,
            });
        }
    };

    const handleDelete = async (): Promise<void> => {
        if (!cartId) {
            setFeedback({
                message: "Cart ID is required for deletion",
                isError: true,
            });
            return;
        }

        try {
            const response = await fetch(
                `https://fakestoreapi.com/carts/${cartId}`,
                {
                    method: "DELETE",
                }
            );
            const data: ApiResponse = await response.json();
            setFeedback({
                message: `Cart deleted: ${data.id}`,
                isError: false,
            });
        } catch (error) {
            setFeedback({
                message: `Error deleting cart: ${(error as Error).message}`,
                isError: true,
            });
        }
    };

    return (
        <Card className="max-w-2xl  mt-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Cart Manager
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* User ID and Cart ID inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                User ID
                            </label>
                            <Input
                                type="number"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter user ID"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Cart ID (for update/delete)
                            </label>
                            <Input
                                type="number"
                                value={cartId}
                                onChange={(e) => setCartId(e.target.value)}
                                placeholder="Enter cart ID"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Products</h3>
                            <Button
                                onClick={handleAddProduct}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Plus size={16} /> Add Product
                            </Button>
                        </div>

                        {products.map((product, index) => (
                            <div
                                key={index}
                                className="flex gap-4 items-center"
                            >
                                <Input
                                    type="number"
                                    value={product.productId}
                                    onChange={(e) =>
                                        handleProductChange(
                                            index,
                                            "productId",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Product ID"
                                    className="flex-1"
                                />
                                <Input
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) =>
                                        handleProductChange(
                                            index,
                                            "quantity",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Quantity"
                                    className="flex-1"
                                />
                                <Button
                                    onClick={() => handleRemoveProduct(index)}
                                    variant="destructive"
                                    size="sm"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Button
                            onClick={handleSubmit}
                            className="flex items-center gap-2"
                            disabled={
                                !userId ||
                                products.some(
                                    (p) => !p.productId || !p.quantity
                                )
                            }
                        >
                            <Plus size={16} /> Create Cart
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            variant="outline"
                            className="flex items-center gap-2"
                            disabled={
                                !cartId ||
                                !userId ||
                                products.some(
                                    (p) => !p.productId || !p.quantity
                                )
                            }
                        >
                            <Edit2 size={16} /> Update Cart
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            className="flex items-center gap-2"
                            disabled={!cartId}
                        >
                            <Trash2 size={16} /> Delete Cart
                        </Button>
                    </div>

                    {/* Feedback Message */}
                    {feedback.message && (
                        <div
                            className={`p-4 rounded-md ${
                                feedback.isError
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                            }`}
                        >
                            {feedback.message}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
