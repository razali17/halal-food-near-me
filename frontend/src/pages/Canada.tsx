import React from "react";
import { UtensilsCrossed } from "lucide-react";
import ProvinceLinks from "../components/ProvinceLinks";
import CuisineSection from "../components/CuisineSection";
import { cuisines } from "../data/cuisines";

const Canada: React.FC = () => {
    const featuredCuisines = cuisines.slice(0, 3);

    return (
        <div>
            <section className="relative bg-gradient-to-r from-red-700 to-red-900 text-white py-20 md:py-28">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://images.pexels.com/photos/1144020/pexels-photo-1144020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
                        mixBlendMode: "overlay",
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-red-500 bg-opacity-80 rounded-full mb-6">
                            <UtensilsCrossed className="h-8 w-8" />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Halal Food in Canada
                        </h1>

                        <p className="text-lg md:text-xl text-gray-100 mb-8">
                            Discover authentic halal restaurants across Canada's
                            provinces. From Toronto's diverse food scene to
                            Vancouver's fusion cuisine, find halal restaurants
                            that cater to your dietary needs.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="#provinces"
                                className="bg-white text-red-700 hover:bg-gray-100 py-3 px-6 rounded-full font-medium shadow-md transition duration-300"
                            >
                                Browse by Province
                            </a>
                            <a
                                href="#explore"
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-700 py-3 px-6 rounded-full font-medium transition duration-300"
                            >
                                Explore Cuisines
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="provinces" className="bg-gray-50 py-16">
                <ProvinceLinks />
            </section>

            <section id="explore" className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Explore Halal Cuisines in Canada
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        From traditional Middle Eastern to fusion Canadian
                        dishes, discover a variety of halal food options that
                        showcase Canada's multicultural food scene.
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
                            Why Choose Halal Food in Canada?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Quality
                            </h3>
                            <p className="text-gray-600">
                                Many Canadian restaurants follow strict halal
                                certification standards, ensuring your food
                                meets Islamic dietary requirements.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Cultural Diversity
                            </h3>
                            <p className="text-gray-600">
                                Experience Canada's multicultural food scene
                                with halal options spanning various cuisines and
                                cooking styles.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Growing Availability
                            </h3>
                            <p className="text-gray-600">
                                Find halal restaurants in major cities and
                                smaller communities across Canada, making it
                                easier to maintain your dietary preferences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Canada;
