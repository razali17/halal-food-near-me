import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import StateDetail from "./pages/StateDetail";
import CityDetail from "./pages/CityDetail";
import Canada from "./pages/Canada";
import ProvinceDetail from "./pages/ProvinceDetail";
import ProvinceCity from "./pages/ProvinceCity";
import UK from "./pages/UK";
import UKCityDetail from "./pages/UKCityDetail";
import CountryPage from "./pages/CountryPage";
import StateOrProvincePage from "./pages/StateOrProvincePage";
import CityPage from "./pages/CityPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import ScrollToTop from "./components/ScrollToTop";
import LoadingOverlay from "./components/LoadingOverlay";

function AppContent() {
    const [isPageLoading, setPageLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (isPageLoading) {
            const shortDelayPages = ["/contact", "/privacy", "/about"];
            const delay = shortDelayPages.includes(location.pathname)
                ? 500
                : 1000;

            const timer = setTimeout(() => {
                setPageLoading(false);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [isPageLoading]);

    return (
        <>
            <ScrollToTop setLoading={setPageLoading} />
            {isPageLoading && <LoadingOverlay />}
            <div className={`flex flex-col min-h-screen`}>
                <Header />
                <main
                    className={`flex-grow ${
                        isPageLoading ? "invisible" : "visible"
                    }`}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/:country" element={<CountryPage />} />
                        <Route
                            path="/:country/:stateorprovince"
                            element={<StateOrProvincePage />}
                        />
                        <Route
                            path="/:country/:stateorprovince/:city"
                            element={<CityPage />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
