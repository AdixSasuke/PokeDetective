import { motion } from "framer-motion";

const LoadingIndicator = ({ theme, message = "Catching Pokémon..." }) => {
    return (
        <motion.div
            className="w-full flex flex-col items-center justify-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="w-10 h-10"
                animate={{
                    rotate: 360,
                }}
                transition={{
                    rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                }}
            >
                <img
                    src="/pokebola.png"
                    alt="Loading Pokémon"
                    className="w-full h-full"
                />
            </motion.div>
            <p
                className={`mt-2 text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
            >
                {message}
            </p>
        </motion.div>
    );
};

export default LoadingIndicator;
