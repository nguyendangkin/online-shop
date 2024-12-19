import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative w-10 h-10">
                <div className="absolute w-10 h-10 border-4 border-transparent border-t-blue-500 rounded-full animate-[spin_1s_linear_infinite]" />
                <div className="absolute w-10 h-10 border-4 border-transparent border-t-blue-500 rounded-full animate-[spin_2s_linear_infinite] opacity-40" />
            </div>
        </div>
    );
};

export default LoadingSpinner;
