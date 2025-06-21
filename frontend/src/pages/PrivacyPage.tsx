import React from "react";

const PrivacyPage: React.FC = () => {
    return (
        <div className="bg-white">
            <header className="bg-emerald-700 text-white py-12 pt-28">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                    <p className="text-xl mt-2">
                        Your privacy is important to us.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 text-gray-700">
                <section className="mb-8 prose lg:prose-xl max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                        Introduction
                    </h2>
                    <p>
                        Welcome to Halal Food Directory. We are committed to
                        protecting your privacy. This Privacy Policy explains
                        how we collect, use, disclose, and safeguard your
                        information when you visit our website.
                    </p>

                    <h2 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">
                        Information We Collect
                    </h2>
                    <p>
                        We may collect personal information from you such as
                        your name, email address, and location data when you
                        voluntarily provide it to us. We may also collect
                        non-personal information, such as browser type,
                        operating system, and web pages visited to help us
                        manage our website.
                    </p>

                    <h2 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">
                        Use of Your Information
                    </h2>
                    <p>
                        Having accurate information permits us to provide you
                        with a smooth, efficient, and customized experience.
                        Specifically, we may use information collected about you
                        via the site to:
                    </p>
                    <ul>
                        <li>Create and manage your account.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Improve our website and services.</li>
                        <li>
                            Monitor and analyze usage and trends to improve your
                            experience with the site.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">
                        Disclosure of Your Information
                    </h2>
                    <p>
                        We do not sell, trade, or otherwise transfer to outside
                        parties your personally identifiable information. This
                        does not include trusted third parties who assist us in
                        operating our website, conducting our business, or
                        servicing you, so long as those parties agree to keep
                        this information confidential.
                    </p>

                    <h2 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">
                        Security of Your Information
                    </h2>
                    <p>
                        We use administrative, technical, and physical security
                        measures to help protect your personal information.
                        While we have taken reasonable steps to secure the
                        personal information you provide to us, please be aware
                        that despite our efforts, no security measures are
                        perfect or impenetrable, and no method of data
                        transmission can be guaranteed against any interception
                        or other type of misuse.
                    </p>

                    <h2 className="text-2xl font-bold text-emerald-800 mt-8 mb-4">
                        Contact Us
                    </h2>
                    <p>
                        If you have questions or comments about this Privacy
                        Policy, please contact us through the contact page.
                    </p>
                </section>
            </main>
        </div>
    );
};

export default PrivacyPage;
