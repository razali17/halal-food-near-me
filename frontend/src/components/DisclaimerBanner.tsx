import React from "react";
import { AlertTriangle } from "lucide-react";

const DisclaimerBanner: React.FC = () => {
    return (
        <div
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md"
            role="alert"
        >
            <div className="flex">
                <div className="py-1">
                    <AlertTriangle className="h-6 w-6 text-yellow-500 mr-4" />
                </div>
                <div>
                    <p className="font-bold">Please Verify Halal Status</p>
                    <p className="text-sm">
                        Restaurant details can change. We do our best to keep
                        information current, but we strongly recommend you
                        confirm the halal status directly with the restaurant
                        before visiting.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerBanner;
