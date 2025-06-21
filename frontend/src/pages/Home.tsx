import React, { useState } from "react";
import {
    UtensilsCrossed,
    ChevronDown,
    ChevronUp,
    MapPin,
    Search,
} from "lucide-react";
import CuisineSection from "../components/CuisineSection";
import StateLinks from "../components/StateLinks";
import { cuisines } from "../data/cuisines";
import { Link } from "react-router-dom";

interface FAQ {
    question: string;
    answer: React.ReactNode;
}

const faqs: FAQ[] = [
    {
        question: "What is Halal food?",
        answer: 'Halal food refers to foods that are permissible according to Islamic law. The term "halal" means "permitted" or "lawful" in Arabic. For food to be considered halal, it must be prepared following specific guidelines outlined in Islamic law, including the method of slaughter for meat and the absence of prohibited ingredients.',
    },
    {
        question: "What makes food Halal?",
        answer: (
            <>
                Food is considered halal when it meets these criteria:
                <br />- Meat comes from permissible animals that are slaughtered
                according to Islamic law
                <br />- No pork or pork by-products
                <br />- No alcohol or intoxicants
                <br />- No blood or blood by-products
                <br />- All ingredients and preparation methods must be halal
                <br />- No cross-contamination with non-halal foods during
                preparation
            </>
        ),
    },
    {
        question: "Is Halal food healthy?",
        answer: "Halal food can be very healthy as it emphasizes cleanliness, quality ingredients, and ethical preparation methods. The halal slaughter process ensures blood is properly drained from meat, which can reduce bacterial growth. However, like any food, the healthiness depends on the specific ingredients and preparation methods used. Halal certification focuses on religious compliance rather than nutritional value.",
    },
    {
        question: "What is Halal meat?",
        answer: (
            <>
                Halal meat comes from permitted animals (such as cattle, sheep,
                goats, and chickens) that are slaughtered according to Islamic
                law. The process, called Zabiha or Dhabihah, requires:
                <br />- The animal must be healthy and alive at the time of
                slaughter
                <br />- The slaughter must be performed by a Muslim
                <br />- God's name must be pronounced before slaughter
                <br />- The slaughter must be done with a sharp knife in one
                swift cut
                <br />- The animal's blood must be fully drained
            </>
        ),
    },
    {
        question: "Can non-Muslims eat Halal food?",
        answer: "Yes, absolutely! Halal food is suitable for everyone, not just Muslims. Many people choose halal food for its quality, cleanliness, and ethical preparation methods. The halal certification process ensures strict adherence to food safety and quality standards, making it a reliable choice for all consumers.",
    },
];

const Home: React.FC = () => {
    const featuredCuisines = cuisines.slice(0, 3);
    const [openFAQs, setOpenFAQs] = useState<number[]>([]);

    const toggleFAQ = (index: number) => {
        setOpenFAQs((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const countries = [
        {
            name: "USA",
            link: "/usa",
            colors: "text-blue-600 border-blue-600 hover:bg-blue-50",
        },
        {
            name: "Canada",
            link: "/canada",
            colors: "text-red-600 border-red-600 hover:bg-red-50",
        },
        {
            name: "United Kingdom",
            link: "/uk",
            colors: "text-green-600 border-green-600 hover:bg-green-50",
        },
    ];

    const features = [
        {
            icon: <Search className="h-12 w-12 text-emerald-600 mb-4" />,
            title: "Find Halal Food Near Me",
            description:
                "Easily search our extensive directory to find halal restaurants in your city. Your next great meal is just a click away.",
        },
        {
            icon: (
                <UtensilsCrossed className="h-12 w-12 text-emerald-600 mb-4" />
            ),
            title: "Explore Diverse Cuisines",
            description:
                "Craving something specific? Find halal Chinese food, authentic halal Mexican food, shawarma, and more. Our listings cover a world of flavors.",
        },
        {
            icon: <MapPin className="h-12 w-12 text-emerald-600 mb-4" />,
            title: "Browse by Location",
            description:
                "Whether you're in Los Angeles or London, our directory helps you explore the best halal food by country, state, or city.",
        },
    ];

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-emerald-700 to-emerald-900 text-white text-center pt-32 pb-24 md:pt-40 md:pb-32">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                            Find the Best Halal Food Near You
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto mb-8 leading-relaxed">
                            Your ultimate directory for halal restaurants, from
                            authentic shawarma to halal Chinese food, Mexican
                            cuisine, and beyond. Discover your next favorite
                            meal with confidence.
                        </p>
                        <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Whether you're searching for "halal food near me" or
                            exploring new cuisines, our comprehensive directory
                            connects you with halal restaurants across the USA,
                            Canada, and the United Kingdom. From traditional
                            favorites to modern fusion dishes, find restaurants
                            that respect Islamic dietary guidelines while
                            delivering exceptional flavors.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                            <a
                                href="#states"
                                className="bg-white text-emerald-700 hover:bg-gray-100 py-4 px-8 rounded-full font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                                Start Your Search
                            </a>
                            <a
                                href="#explore"
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-700 py-4 px-8 rounded-full font-semibold text-lg transition-all duration-300"
                            >
                                Explore Cuisines
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="text-center p-6 flex flex-col h-full items-center"
                            >
                                {feature.icon}
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action - Browse by Country */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Start Your Search
                    </h2>
                    <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                        Where can you find halal food near you? Begin by
                        selecting a country below.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {countries.map((country) => (
                            <Link
                                key={country.name}
                                to={country.link}
                                className={`block w-full md:w-auto text-center px-12 py-6 rounded-lg bg-white font-semibold text-2xl shadow-lg transform hover:scale-105 transition-all duration-300 border-2 ${country.colors}`}
                            >
                                {country.name}
                            </Link>
                        ))}
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
                        Discover a variety of halal food options across
                        different cuisines, prepared in accordance with Islamic
                        dietary laws while maintaining authentic flavors and
                        traditions.
                    </p>
                </div>

                {featuredCuisines.map((cuisine) => (
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
                            Hear from our users who have discovered amazing
                            halal restaurants through our directory.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="w-5 h-5 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                                "This directory helped me find an amazing halal
                                Mexican restaurant I never knew existed in my
                                city. The food was authentic and delicious!"
                            </p>
                            <div className="font-medium">Sarah M.</div>
                            <div className="text-sm text-gray-500">
                                Chicago, IL
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="w-5 h-5 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                                "As a Muslim foodie, this directory is a
                                game-changer! I can finally explore different
                                cuisines without worrying about dietary
                                restrictions."
                            </p>
                            <div className="font-medium">Ahmad K.</div>
                            <div className="text-sm text-gray-500">
                                Houston, TX
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="w-5 h-5 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                                "I travel frequently for work, and this
                                directory has been invaluable in helping me find
                                halal options in every city I visit."
                            </p>
                            <div className="font-medium">Jessica R.</div>
                            <div className="text-sm text-gray-500">
                                San Francisco, CA
                            </div>
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
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {faq.question}
                                    </h3>
                                    {openFAQs.includes(index) ? (
                                        <ChevronUp className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>

                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                        openFAQs.includes(index)
                                            ? "max-h-96 pb-6"
                                            : "max-h-0"
                                    }`}
                                >
                                    <p className="text-gray-600">
                                        {faq.answer}
                                    </p>
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
