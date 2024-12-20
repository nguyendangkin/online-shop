"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { setToken } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(
                "https://fakestoreapi.com/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                }
            );

            // Kiểm tra response có ok không trước khi parse JSON
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const loginData = await response.json();
            const token = loginData.token;

            if (token) {
                await fetch("/api", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                setToken(token);
                toast({
                    title: "success",
                    description: "Login successful!",
                });
                router.push("/");
            }
        } catch (error) {
            // Xử lý tất cả các loại lỗi ở đây
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description:
                        error.message === "Invalid credentials"
                            ? "Invalid username or password"
                            : "An error occurred during login",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Login
                </h1>
                <form className="space-y-4" onSubmit={handleLogin}>
                    {/* Email Field */}
                    <div>
                        <Label htmlFor="email" className="text-gray-700">
                            Email
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="mt-2 w-full"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <Label htmlFor="password" className="text-gray-700">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="mt-2 w-full"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
}