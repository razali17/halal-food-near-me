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

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/canada" element={<Canada />} />
                        <Route path="/uk" element={<UK />} />
                        <Route
                            path="/uk/city/:citySlug"
                            element={<UKCityDetail />}
                        />
                        <Route
                            path="/state/:stateSlug"
                            element={<StateDetail />}
                        />
                        <Route
                            path="/state/:stateSlug/:citySlug"
                            element={<CityDetail />}
                        />
                        <Route
                            path="/province/:provinceSlug"
                            element={<ProvinceDetail />}
                        />
                        <Route
                            path="/province/:provinceSlug/:citySlug"
                            element={<ProvinceCity />}
                        />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
