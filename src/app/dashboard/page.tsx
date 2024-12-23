"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/layouts/loading/LoadingSpinner";

interface Product {
    id?: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

const addProduct = async (product: Product) => {
    const response = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });
    const data = await response.json();
    return data;
};

const updateProduct = async (id: number, updatedProduct: Product) => {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
    });
    const data = await response.json();
    return data;
};

const deleteProduct = async (id: number) => {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE",
    });
    const data = await response.json();
    return data;
};

export default function DashboardPage() {
    const { token } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<Product>({
        title: "",
        price: 0,
        description: "",
        image: "",
        category: "",
    });
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("https://fakestoreapi.com/products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch products",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push("/");
        }
    }, [token, router]);

    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    }, [token]);

    if (!token) {
        return null;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const handleAddProduct = async () => {
        setIsLoading(true);
        try {
            const addedProduct = await addProduct(newProduct);
            setProducts([...products, addedProduct]);
            setNewProduct({
                title: "",
                price: 0,
                description: "",
                image: "",
                category: "",
            });
            toast({
                title: "Success",
                description: "Product added successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add product",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProduct = async () => {
        if (!editProduct?.id) return;
        setIsLoading(true);
        try {
            const updatedProduct = await updateProduct(
                editProduct.id,
                editProduct
            );
            setProducts(
                products.map((product) =>
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );
            setEditProduct(null);
            toast({
                title: "Success",
                description: "Product updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update product",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        setIsLoading(true);
        try {
            await deleteProduct(id);
            setProducts(products.filter((product) => product.id !== id));
            toast({
                title: "Success",
                description: "Product deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        field: keyof Product
    ) => {
        const { value } = e.target;
        if (editProduct) {
            setEditProduct({ ...editProduct, [field]: value });
        } else {
            setNewProduct({ ...newProduct, [field]: value });
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Product Dashboard
            </h1>

            {/* Thêm sản phẩm */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={
                            editProduct ? editProduct.title : newProduct.title
                        }
                        onChange={(e) => handleInputChange(e, "title")}
                        className="border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={
                            editProduct ? editProduct.price : newProduct.price
                        }
                        onChange={(e) => handleInputChange(e, "price")}
                        className="border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={
                            editProduct
                                ? editProduct.description
                                : newProduct.description
                        }
                        onChange={(e) => handleInputChange(e, "description")}
                        className="border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={
                            editProduct ? editProduct.image : newProduct.image
                        }
                        onChange={(e) => handleInputChange(e, "image")}
                        className="border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={
                            editProduct
                                ? editProduct.category
                                : newProduct.category
                        }
                        onChange={(e) => handleInputChange(e, "category")}
                        className="border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    {editProduct ? (
                        <>
                            <button
                                onClick={() => setEditProduct(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProduct}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Update Product"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleAddProduct}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Adding..." : "Add Product"}
                        </button>
                    )}
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <h2 className="text-2xl font-semibold mb-4">Products List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-48 object-contain mb-4"
                        />
                        <div>
                            <h3 className="text-lg font-semibold truncate">
                                {product.title}
                            </h3>
                            <p className="text-green-600 font-bold">
                                ${product.price}
                            </p>
                            <p className="text-gray-600 text-sm mb-4">
                                {product.category}
                            </p>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {product.description}
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setEditProduct(product)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                                    disabled={isLoading}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteProduct(product.id!)
                                    }
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                                    disabled={isLoading}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
