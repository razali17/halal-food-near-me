import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
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
        </Router>
    );
}

export default App;
