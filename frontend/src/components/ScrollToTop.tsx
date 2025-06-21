import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
    setLoading: (loading: boolean) => void;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ setLoading }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        setLoading(true);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [pathname, setLoading]);

    return null;
};

export default ScrollToTop;
