"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GeoLocation {
    lat: string;
    long: string;
}

interface Address {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: GeoLocation;
}

interface Name {
    firstname: string;
    lastname: string;
}

interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    name: Name;
    address: Address;
    phone: string;
}

interface Product {
    productId: number;
    quantity: number;
}

interface Cart {
    id: number;
    userId: number;
    date: string;
    products: Product[];
}

export default function UserCartPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userCarts, setUserCarts] = useState<Cart[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://fakestoreapi.com/users");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const fetchUserCarts = async (userId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://fakestoreapi.com/carts/user/${userId}`
            );
            const data = await response.json();
            setUserCarts(data);
        } catch (error) {
            console.error("Error fetching user carts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserChange = (userId: string) => {
        const user = users.find((u) => u.id.toString() === userId);
        if (user) {
            setSelectedUser(user);
            fetchUserCarts(userId);
        }
    };

    return (
        <div className="container max-w-2xl">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>User Cart Viewer</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={handleUserChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Users</SelectLabel>
                                {users.map((user) => (
                                    <SelectItem
                                        key={user.id}
                                        value={user.id.toString()}
                                    >
                                        {user.name.firstname}{" "}
                                        {user.name.lastname} (User ID: {user.id}
                                        )
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedUser && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Carts for {selectedUser.name.firstname}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userCarts.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">
                                        No carts found for this user
                                    </p>
                                ) : (
                                    userCarts.map((cart) => (
                                        <Card key={cart.id}>
                                            <CardContent className="pt-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">
                                                        Cart #{cart.id}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(
                                                            cart.date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Products:{" "}
                                                    {cart.products?.length || 0}{" "}
                                                    items
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
