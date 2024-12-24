"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpDown, Users, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Geolocation {
    lat: string;
    long: string;
}

interface Address {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: Geolocation;
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

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [limit, setLimit] = useState<number>(5);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchUsers();
    }, [limit, sortOrder]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://fakestoreapi.com/users?limit=${limit}&sort=${sortOrder}`
            );
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <Card>
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            User List
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <select
                                className="p-2 border rounded-md"
                                value={limit}
                                onChange={(e) =>
                                    setLimit(Number(e.target.value))
                                }
                            >
                                <option value={5}>5 users</option>
                                <option value={10}>10 users</option>
                                <option value={20}>20 users</option>
                            </select>
                            <button
                                onClick={toggleSortOrder}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                                Sort{" "}
                                {sortOrder === "asc"
                                    ? "Descending"
                                    : "Ascending"}
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {users.map((user) => (
                                <Card key={user.id} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {user.name.firstname}{" "}
                                                        {user.name.lastname}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        @{user.username}
                                                    </p>
                                                </div>
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    ID: {user.id}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-sm flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    {user.phone}
                                                </p>
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                                    <div className="text-sm">
                                                        <p>
                                                            {
                                                                user.address
                                                                    .street
                                                            }
                                                        </p>
                                                        <p>
                                                            {user.address.city},{" "}
                                                            {
                                                                user.address
                                                                    .zipcode
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t">
                                                <p className="text-sm text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserList;
