"use client";

import { useAuth } from "@/contexts/AuthContext";
import React from "react";

export default function page() {
    const { token } = useAuth();

    return <div>cart</div>;
}
