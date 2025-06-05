import React from "react";
import { MapPin, List } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import UKCityLinks from "../components/UKCityLinks";

const UK: React.FC = () => {
    return (
        <div>
            <Breadcrumbs
                customItems={[{ name: "United Kingdom", path: "/uk" }]}
            />

            <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg)",
                        mixBlendMode: "overlay",
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-start">
                        <MapPin className="h-10 w-10 mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Halal Food in the United Kingdom
                            </h1>
                            <p className="text-lg text-gray-100 max-w-3xl">
                                Discover the best halal restaurants across the
                                United Kingdom. From traditional British cuisine
                                to international flavors, find authentic halal
                                dining options in cities throughout the UK.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-6">
                        <List className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-xl font-semibold">
                            Quick Navigation
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href="#cities"
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="font-medium text-blue-600">
                                Browse by City
                            </h3>
                            <p className="text-sm text-gray-600">
                                Find halal restaurants in specific cities
                            </p>
                        </a>
                        <a
                            href="#about"
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="font-medium text-blue-600">
                                About Halal Food in the UK
                            </h3>
                            <p className="text-sm text-gray-600">
                                Learn about the local halal food scene
                            </p>
                        </a>
                    </div>
                </div>
            </div>

            <section id="cities">
                <UKCityLinks />
            </section>

            <section className="container mx-auto px-4 py-12">
                <div id="about" className="bg-gray-50 rounded-lg p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        About Halal Food in the United Kingdom
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The United Kingdom boasts a vibrant and diverse halal
                        food scene, reflecting its multicultural population and
                        rich culinary traditions. From bustling cities to quaint
                        towns, you'll find a wide variety of halal dining
                        options that cater to all tastes and preferences.
                    </p>
                    <p className="text-gray-600 mb-4">
                        Major cities like London, Birmingham, Manchester, and
                        Bradford are particularly well-known for their extensive
                        selection of halal restaurants, offering everything from
                        traditional British fare to international cuisines. Many
                        establishments now provide halal options, making it
                        easier for Muslims to enjoy diverse dining experiences
                        while adhering to their dietary requirements.
                    </p>
                    <p className="text-gray-600">
                        Our directory helps you discover these culinary gems
                        across the UK, with detailed information about each
                        restaurant, including their specialties, prayer
                        facilities, and halal certification status. Whether
                        you're a local resident or a visitor, you'll find the
                        perfect halal dining spot that suits your taste and
                        preferences.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default UK;
