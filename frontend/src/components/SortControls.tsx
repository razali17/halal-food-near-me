import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortOption = "name" | "rating" | "distance" | "random";

interface SortControlsProps {
    sort: SortOption;
    setSort: (sort: SortOption) => void;
    direction: "asc" | "desc";
    setDirection: (direction: "asc" | "desc") => void;
}

const SortControls: React.FC<SortControlsProps> = ({
    sort,
    setSort,
    direction,
    setDirection,
}) => {
    const handleSortChange = (newSort: SortOption) => {
        if (newSort === sort) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSort(newSort);
            setDirection("asc");
        }
    };

    const getSortLabel = (sortOption: SortOption) => {
        switch (sortOption) {
            case "name":
                return "Name";
            case "rating":
                return "Rating";
            case "distance":
                return "Distance";
            case "random":
                return "Random";
            default:
                return sortOption;
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex gap-1">
                {(["name", "rating", "distance", "random"] as SortOption[]).map(
                    (sortOption) => (
                        <button
                            key={sortOption}
                            onClick={() => handleSortChange(sortOption)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 ${
                                sort === sortOption
                                    ? "bg-primary text-black border-2 border-black"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {getSortLabel(sortOption)}
                            {sort === sortOption &&
                                (direction === "asc" ? (
                                    <ArrowUp className="h-4 w-4" />
                                ) : (
                                    <ArrowDown className="h-4 w-4" />
                                ))}
                            {sort !== sortOption && (
                                <ArrowUpDown className="h-4 w-4 opacity-50" />
                            )}
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default SortControls;
