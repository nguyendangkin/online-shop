"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const { token, setToken } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Gửi yêu cầu xóa cookie qua API
            const response = await fetch("/api", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Xóa token khỏi context và localStorage
                setToken(null);

                // Chuyển hướng về trang chủ
                router.push("/");
            } else {
                console.error("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
        }
    };

    return (
        <header className="bg-white border-b shadow-sm">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo */}
                <div className="text-lg font-bold text-gray-800">
                    <Link href="/">Natasha</Link>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Home
                    </Link>
                    {token && (
                        <Link
                            href="/dashboard"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Dashboard
                        </Link>
                    )}
                    {token && (
                        <Link
                            href="/cart"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Cart
                        </Link>
                    )}
                    <Link
                        href="/contact"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Contact
                    </Link>
                </nav>

                {/* Action Buttons */}
                <div className="space-x-4 flex items-center">
                    {/* Chào mừng */}
                    {token && (
                        <div className="text-sm font-semibold mr-4">
                            Welcome To Back
                        </div>
                    )}
                    {!token ? (
                        pathname !== "/login" && (
                            <Button asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                        )
                    ) : (
                        <Button onClick={handleLogout}>Logout</Button>
                    )}
                </div>
            </div>
        </header>
    );
}
