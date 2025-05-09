/**
 * Utility functions for standardizing colors in animations
 */

/**
 * Converts a color to RGB format for consistent animations
 * @param {string} color - The color to convert (hex, named, etc.)
 * @returns {string} - The color in rgb() format
 */
export const toRgbColor = (color) => {
    // If color is not provided or is null/undefined, return a default
    if (!color) {
        return "rgb(0, 0, 0)";
    }

    // If the color is already in rgb format, return it
    if (color.startsWith("rgb") || color.startsWith("rgba")) {
        return color;
    }

    // Simple color name mapping to rgb
    const colorMap = {
        white: "rgb(255, 255, 255)",
        black: "rgb(0, 0, 0)",
        red: "rgb(255, 0, 0)",
        green: "rgb(0, 128, 0)",
        blue: "rgb(0, 0, 255)",
        yellow: "rgb(255, 255, 0)",
        transparent: "rgba(0, 0, 0, 0)",
        // Add tailwind colors with rgb equivalents
        "gray-100": "rgb(243, 244, 246)",
        "gray-200": "rgb(229, 231, 235)",
        "gray-300": "rgb(209, 213, 219)",
        "gray-400": "rgb(156, 163, 175)",
        "gray-500": "rgb(107, 114, 128)",
        "gray-600": "rgb(75, 85, 99)",
        "gray-700": "rgb(55, 65, 81)",
        "gray-800": "rgb(31, 41, 55)",
        "gray-900": "rgb(17, 24, 39)",
    };

    // Return mapped color if it exists
    if (colorMap[color]) {
        return colorMap[color];
    }

    // Convert hex to rgb
    if (color.startsWith("#")) {
        let r = 0,
            g = 0,
            b = 0;

        // #RGB or #RGBA
        if (color.length === 4 || color.length === 5) {
            r = parseInt(color[1] + color[1], 16);
            g = parseInt(color[2] + color[2], 16);
            b = parseInt(color[3] + color[3], 16);

            return `rgb(${r}, ${g}, ${b})`;
        }

        // #RRGGBB or #RRGGBBAA
        if (color.length === 7 || color.length === 9) {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);

            return `rgb(${r}, ${g}, ${b})`;
        }
    } // For oklab colors or other non-standard formats, convert to a safe RGB equivalent
    if (color.startsWith("oklab") || color.startsWith("oklch")) {
        // Return a safe RGB color for these color spaces
        return "rgb(128, 128, 128)"; // Default gray
    }
    // If all else fails, return a default color
    console.warn(`Could not convert color: ${color}, using default.`);
    return "rgb(128, 128, 128)";
};
