import React from "react";
import FoodSpinner from "./FoodSpinner";

const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-[9999]">
            <FoodSpinner message="Loading..." />
        </div>
    );
};

export default LoadingOverlay;
