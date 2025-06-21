import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage: React.FC = () => {
    return (
        <div className="bg-gray-50">
            <header className="bg-emerald-700 text-white py-12 pt-28">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold">Get In Touch</h1>
                    <p className="text-xl mt-2">
                        We'd love to hear from you. Send us a message or find
                        our contact details below.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Send Us a Message
                        </h2>
                        <form>
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-gray-700 font-semibold mb-2"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 font-semibold mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="mb-6">
                                <label
                                    htmlFor="message"
                                    className="block text-gray-700 font-semibold mb-2"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Your message..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    {/* <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Contact Information
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Have a question, a suggestion for a restaurant,
                                or need to report an issue? Reach out to us
                                directly.
                            </p>
                            <div className="flex items-center text-lg mb-4">
                                <Mail className="h-6 w-6 mr-4 text-emerald-600" />
                                <a
                                    href="mailto:contact@halalfoodnearme.org"
                                    className="text-gray-800 hover:text-emerald-700"
                                >
                                    contact@halalfoodnearme.org
                                </a>
                            </div>
                            <div className="flex items-center text-lg">
                                <Phone className="h-6 w-6 mr-4 text-emerald-600" />
                                <span className="text-gray-800">
                                    (123) 456-7890
                                </span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </main>
        </div>
    );
};

export default ContactPage;
