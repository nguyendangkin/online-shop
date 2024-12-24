"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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

export default function UserDetail() {
    const params = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://fakestoreapi.com/users/${params.id}`
                );
                if (!response.ok) {
                    throw new Error("User not found");
                }
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch user"
                );
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchUser();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <Link
                    href="/users"
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Users List
                </Link>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <Link
                href="/users"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Users List
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <User className="h-6 w-6" />
                        User Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Basic Info Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            {user.name.firstname} {user.name.lastname}
                        </h2>
                        <p className="text-gray-600">@{user.username}</p>
                    </div>

                    {/* Contact Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span>{user.phone}</span>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="border-t pt-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-2">Address</h3>
                                <div className="space-y-1 text-gray-600">
                                    <p>{user.address.street}</p>
                                    <p>
                                        {user.address.city},{" "}
                                        {user.address.zipcode}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Coordinates:{" "}
                                        {user.address.geolocation.lat},{" "}
                                        {user.address.geolocation.long}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
