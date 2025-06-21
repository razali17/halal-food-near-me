import React from "react";

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white">
            <header className="bg-emerald-700 text-white py-12 pt-28">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold">
                        About Halal Food Near Me
                    </h1>
                    <p className="text-xl mt-2">
                        Your Trusted Guide to Halal Dining
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 text-gray-700">
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-emerald-800 mb-4">
                        Our Mission: Your Halal Food Finder
                    </h2>
                    <p className="text-lg leading-relaxed">
                        At Halal Food Near Me, our mission is simple: to make
                        finding halal food easy and reliable for everyone. When
                        you ask,{" "}
                        <strong className="font-semibold">
                            "Where can I buy halal food near me?"
                        </strong>
                        , our directory is your definitive answer. Whether
                        you're searching for a quick meal, the{" "}
                        <strong className="font-semibold">
                            best halal food near you
                        </strong>{" "}
                        for a family dinner, or specific cuisines like{" "}
                        <strong className="font-semibold">
                            halal Chinese food
                        </strong>
                        , our platform connects you with trusted options.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-emerald-800 mb-4">
                        What is Halal Food?
                    </h2>
                    <p className="text-lg leading-relaxed">
                        For those wondering,{" "}
                        <strong className="font-semibold">
                            "What is halal food?"
                        </strong>
                        , it refers to food that is permissible according to
                        Islamic law. This includes not only the type of food
                        (e.g., ensuring pork is not used) but also the method of
                        preparation, such as the humane treatment and slaughter
                        of animals like{" "}
                        <strong className="font-semibold">chicken</strong>. We
                        verify our listings to ensure they meet these standards,
                        so you can dine with confidence.
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-emerald-800 mb-4">
                        Why Choose Us for Halal Restaurants?
                    </h2>
                    <p className="text-lg leading-relaxed mb-4">
                        Finding{" "}
                        <strong className="font-semibold">restaurants</strong>{" "}
                        shouldn't be a challenge. Our platform provides detailed
                        information to help you make informed choices,
                        including:
                    </p>
                    <ul className="list-disc list-inside text-lg space-y-2">
                        <li>
                            Verified listings of{" "}
                            <strong className="font-semibold">
                                halal restaurants
                            </strong>
                            .
                        </li>
                        <li>
                            A wide range of cuisines, including sought-after
                            options like authentic{" "}
                            <strong className="font-semibold">
                                halal Mexican food
                            </strong>{" "}
                            and{" "}
                            <strong className="font-semibold">shawarma</strong>.
                        </li>
                        <li>
                            User reviews and ratings to help you decide where to
                            eat.
                        </li>
                        <li>
                            An easy-to-use directory for finding{" "}
                            <strong className="font-semibold">
                                halal food
                            </strong>{" "}
                            in the USA, Canada (e.g., Toronto), and the UK
                            (e.g., London).
                        </li>
                        <li>
                            Information on whether restaurants offer delivery
                            through services like{" "}
                            <strong className="font-semibold">Uber Eats</strong>
                            .
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-emerald-800 mb-4">
                        Our Community
                    </h2>
                    <p className="text-lg leading-relaxed">
                        This platform thrives because of our community. We
                        encourage you to reach out, share your favorite spots,
                        and help us grow our directory. Together, we can build
                        the most comprehensive and trusted guide to{" "}
                        <strong className="font-semibold">
                            halal food near you
                        </strong>{" "}
                        and beyond. Thank you for being a part of our journey to
                        celebrate and share the world of halal cuisine.
                    </p>
                </section>
            </main>
        </div>
    );
};

export default AboutPage;
