import { useState, useEffect } from "react";

const useDarkMode = () => {
    // Get user preference from localStorage or system preference
    const getInitialTheme = () => {
        if (typeof window !== "undefined" && window.localStorage) {
            const storedPrefs = window.localStorage.getItem("color-theme");
            if (typeof storedPrefs === "string") {
                return storedPrefs;
            }

            const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
            if (userMedia.matches) {
                return "dark";
            }
        }
        return "light";
    };

    const [theme, setTheme] = useState(getInitialTheme);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    // Update localStorage and document class when theme changes
    useEffect(() => {
        const root = window.document.documentElement;
        const isDark = theme === "dark";

        root.classList.remove(isDark ? "light" : "dark");
        root.classList.add(theme);

        localStorage.setItem("color-theme", theme);
    }, [theme]);

    return { theme, toggleTheme };
};

export default useDarkMode;
