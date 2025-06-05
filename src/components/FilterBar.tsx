import React from 'react';
import { Filter } from 'lucide-react';
import { cuisines } from '../data/cuisines';

interface FilterBarProps {
  activeCuisine: string;
  onCuisineChange: (cuisine: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeCuisine, onCuisineChange }) => {
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-emerald-600 mr-2" />
        <h3 className="text-lg font-medium">Filter by Cuisine</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCuisineChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
            activeCuisine === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Cuisines
        </button>
        
        {cuisines.map(cuisine => (
          <button
            key={cuisine.id}
            onClick={() => onCuisineChange(cuisine.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeCuisine === cuisine.id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cuisine.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;