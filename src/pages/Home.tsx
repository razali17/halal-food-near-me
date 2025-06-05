import React, { useState } from 'react';
import { UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react';
import CuisineSection from '../components/CuisineSection';
import StateLinks from '../components/StateLinks';
import { cuisines } from '../data/cuisines';

interface FAQ {
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQ[] = [
  {
    question: "What is Halal food?",
    answer: "Halal food refers to foods that are permissible according to Islamic law. The term \"halal\" means \"permitted\" or \"lawful\" in Arabic. For food to be considered halal, it must be prepared following specific guidelines outlined in Islamic law, including the method of slaughter for meat and the absence of prohibited ingredients."
  },
  {
    question: "What makes food Halal?",
    answer: <>
      Food is considered halal when it meets these criteria:
      <br />- Meat comes from permissible animals that are slaughtered according to Islamic law
      <br />- No pork or pork by-products
      <br />- No alcohol or intoxicants
      <br />- No blood or blood by-products
      <br />- All ingredients and preparation methods must be halal
      <br />- No cross-contamination with non-halal foods during preparation
    </>
  },
  {
    question: "Is Halal food healthy?",
    answer: "Halal food can be very healthy as it emphasizes cleanliness, quality ingredients, and ethical preparation methods. The halal slaughter process ensures blood is properly drained from meat, which can reduce bacterial growth. However, like any food, the healthiness depends on the specific ingredients and preparation methods used. Halal certification focuses on religious compliance rather than nutritional value."
  },
  {
    question: "What is Halal meat?",
    answer: <>
      Halal meat comes from permitted animals (such as cattle, sheep, goats, and chickens) that are slaughtered according to Islamic law. The process, called Zabiha or Dhabihah, requires:
      <br />- The animal must be healthy and alive at the time of slaughter
      <br />- The slaughter must be performed by a Muslim
      <br />- God's name must be pronounced before slaughter
      <br />- The slaughter must be done with a sharp knife in one swift cut
      <br />- The animal's blood must be fully drained
    </>
  },
  {
    question: "Can non-Muslims eat Halal food?",
    answer: "Yes, absolutely! Halal food is suitable for everyone, not just Muslims. Many people choose halal food for its quality, cleanliness, and ethical preparation methods. The halal certification process ensures strict adherence to food safety and quality standards, making it a reliable choice for all consumers."
  }
];

const Home: React.FC = () => {
  const featuredCuisines = cuisines.slice(0, 3);
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  
  return (
    <div>
      <section className="relative bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
            mixBlendMode: 'overlay'
          }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500 bg-opacity-80 rounded-full mb-6">
              <UtensilsCrossed className="h-8 w-8" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Halal Food Near You
            </h1>
            
            <p className="text-lg md:text-xl text-gray-100 mb-8">
              Discover the best halal restaurants across the United States offering a variety of cuisines including 
              halal Mexican, halal Chinese, halal Indian, and many more options for you to enjoy.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="#states" 
                className="bg-white text-emerald-700 hover:bg-gray-100 py-3 px-6 rounded-full font-medium shadow-md transition duration-300"
              >
                Browse by State
              </a>
              <a 
                href="#explore" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-700 py-3 px-6 rounded-full font-medium transition duration-300"
              >
                Explore Cuisines
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <section id="states" className="bg-gray-50 py-16">
        <StateLinks />
      </section>
      
      <section id="explore" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Explore Halal Cuisines
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover a variety of halal food options across different cuisines, prepared in accordance with Islamic dietary laws while maintaining authentic flavors and traditions.
          </p>
        </div>
        
        {featuredCuisines.map(cuisine => (
          <CuisineSection key={cuisine.id} cuisine={cuisine} />
        ))}
      </section>
      
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What People Are Saying
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear from our users who have discovered amazing halal restaurants through our directory.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "This directory helped me find an amazing halal Mexican restaurant I never knew existed in my city. The food was authentic and delicious!"
              </p>
              <div className="font-medium">Sarah M.</div>
              <div className="text-sm text-gray-500">Chicago, IL</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "As a Muslim foodie, this directory is a game-changer! I can finally explore different cuisines without worrying about dietary restrictions."
              </p>
              <div className="font-medium">Ahmad K.</div>
              <div className="text-sm text-gray-500">Houston, TX</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "I travel frequently for work, and this directory has been invaluable in helping me find halal options in every city I visit."
              </p>
              <div className="font-medium">Jessica R.</div>
              <div className="text-sm text-gray-500">San Francisco, CA</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                  {openFAQs.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQs.includes(index) ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;