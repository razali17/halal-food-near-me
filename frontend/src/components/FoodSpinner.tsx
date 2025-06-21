import React from "react";
import { UtensilsCrossed } from "lucide-react";

const FoodSpinner: React.FC<{ message?: string }> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin-slow rounded-full p-4 bg-gradient-to-br from-emerald-200 to-emerald-400 shadow-lg mb-4">
                <UtensilsCrossed className="h-12 w-12 text-emerald-700" />
            </div>
            <div className="text-lg text-emerald-700 font-semibold">
                {message || "Loading delicious halal food..."}
            </div>
        </div>
    );
};

export default FoodSpinner;

// Add custom spin animation to your global CSS (e.g., in index.css or tailwind.config.js):
// .animate-spin-slow { animation: spin 1.5s linear infinite; }
