"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Tạo context
const AuthContext = createContext<{
    token: string | null;
    setToken: (token: string | null) => void;
}>({
    token: null,
    setToken: () => {},
});

// Provider cho AuthContext
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [token, setToken] = useState<string | null>(null);

    // Lấy token từ cookie khi load trang
    useEffect(() => {
        const fetchToken = async () => {
            const response = await fetch("/api");
            const data = await response.json();
            setToken(data.token || null);
        };
        fetchToken();
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tiện ích để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
