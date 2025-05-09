import { motion } from "framer-motion";
import { useState } from "react";
import { toRgbColor } from "../../utils/colorUtils";

// Optimized component for displaying Pokémon images
const PokemonImage = ({ src, name, size = "md", className = "" }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    // Define sizes
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
    };

    const sizeClass = sizes[size] || sizes.md;

    // Handle loading error
    const handleError = () => {
        setError(true);
        setIsLoaded(true);
    };
    return (
        <div className={`${sizeClass} relative overflow-hidden ${className}`}>
            {/* Loading animation with pokebola */}
            {(!isLoaded || error || !src) && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {" "}
                    <motion.img
                        src="/pokebola.png"
                        alt="Loading..."
                        className="w-3/4 h-3/4" // Made slightly larger for better visibility
                        animate={{
                            rotate: 360,
                            scale: [0.85, 1, 0.85],
                        }}
                        transition={{
                            rotate: {
                                duration: 1.2,
                                ease: "linear",
                                repeat: Infinity,
                            },
                            scale: { duration: 1.5, repeat: Infinity },
                        }}
                    />
                </motion.div>
            )}

            {/* Actual image */}
            {src && (
                <img
                    src={src}
                    alt={`${name} sprite`}
                    className={`w-full h-full object-contain ${
                        isLoaded && !error ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-300`}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    onError={handleError}
                />
            )}
        </div>
    );
};

export default PokemonImage;
