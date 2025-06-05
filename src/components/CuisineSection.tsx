import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CuisineType } from '../types';

interface CuisineSectionProps {
  cuisine: CuisineType;
}

const CuisineSection: React.FC<CuisineSectionProps> = ({ cuisine }) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
        Halal {cuisine.name} Food
      </h2>
      
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/3 overflow-hidden rounded-lg shadow-md mb-4 md:mb-0">
          <img 
            src={cuisine.image} 
            alt={`Halal ${cuisine.name} Food`} 
            className="w-full h-64 object-cover transform hover:scale-105 transition duration-500"
          />
        </div>
        
        <div className="w-full md:w-2/3">
          <p className="text-gray-600 mb-4">
            {cuisine.description}
          </p>
          
          <div className="mb-6">
            <Link 
              to={`/cuisine/${cuisine.id}`}
              className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Find all {cuisine.name} halal restaurants
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-2">Sample Listings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="font-medium">{cuisine.name} Delight</div>
                <div className="text-sm text-gray-500">New York, NY</div>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">(120 reviews)</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="font-medium">Authentic {cuisine.name}</div>
                <div className="text-sm text-gray-500">Chicago, IL</div>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span className="text-xs text-gray-500 ml-1">(95 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuisineSection;