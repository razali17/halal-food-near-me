import React from 'react';
import { Link } from 'react-router-dom';
import { getCitiesByState } from '../data/cities';

interface CityLinksProps {
  state: string;
  stateSlug: string;
}

const CityLinks: React.FC<CityLinksProps> = ({ state, stateSlug }) => {
  const cities = getCitiesByState(state);
  
  if (cities.length === 0) {
    return null;
  }
  
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Find Halal Food By City</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {cities.map((city) => (
            <Link 
              key={city.slug}
              to={`/state/${stateSlug}/${city.slug}`}
              className="block text-gray-700 hover:text-emerald-600 hover:underline transition duration-300"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityLinks;