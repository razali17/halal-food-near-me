import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
    state?: string;
    province?: string;
    customItems?: Array<{
        name: string;
        path: string;
    }>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    state,
    province,
    customItems,
}) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    // If we have custom items, use those instead
    if (customItems && customItems.length > 0) {
        return (
            <nav className="flex py-3 px-4 text-gray-600 text-sm">
                <ol className="flex items-center flex-wrap">
                    <li className="flex items-center">
                        <Link
                            to="/"
                            className="text-emerald-600 hover:text-emerald-800 flex items-center"
                        >
                            <Home className="h-4 w-4" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </li>

                    {customItems.map((item, index) => {
                        const isLast = index === customItems.length - 1;

                        return (
                            <li key={index} className="flex items-center">
                                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                                {isLast ? (
                                    <span className="font-medium text-gray-800">
                                        {item.name}
                                    </span>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className="text-emerald-600 hover:text-emerald-800"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        );
    }

    // Default breadcrumbs based on path
    return (
        <nav className="flex py-3 px-4 text-gray-600 text-sm">
            <ol className="flex items-center flex-wrap">
                <li className="flex items-center">
                    <Link
                        to="/"
                        className="text-emerald-600 hover:text-emerald-800 flex items-center"
                    >
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames
                        .slice(0, index + 1)
                        .join("/")}`;
                    const isLast = index === pathnames.length - 1;
                    let displayName = name.replace(/-/g, " ");

                    if (isLast) {
                        if (state) {
                            displayName = `Halal food in ${state}`;
                        } else if (province) {
                            displayName = `Halal food in ${province}`;
                        }
                    }

                    return (
                        <li key={index} className="flex items-center">
                            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                            {isLast ? (
                                <span className="font-medium text-gray-800 capitalize">
                                    {displayName}
                                </span>
                            ) : (
                                <Link
                                    to={routeTo}
                                    className={`hover:text-emerald-800 capitalize ${
                                        name === "canada"
                                            ? "text-red-600 hover:text-red-800"
                                            : "text-emerald-600"
                                    }`}
                                >
                                    {displayName}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
