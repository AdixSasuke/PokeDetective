import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const HintsList = ({ hints, theme }) => {
    if (!hints || hints.length === 0) return null;
    const isDark = theme === "dark";

    return (
        <motion.div
            className={`w-full ${
                isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
            } border rounded-xl p-3 sm:p-4 shadow-sm`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            <h3
                className={`font-medium ${
                    isDark ? "text-blue-400" : "text-blue-600"
                } mb-2 sm:mb-3 flex items-center text-sm sm:text-base`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                    />
                </svg>
                Poké Hints:
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <AnimatePresence>
                    {hints.map((hint, index) => (
                        <motion.li
                            key={index}
                            className="flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <motion.span
                                className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full ${
                                    isDark
                                        ? "bg-blue-900 text-blue-400"
                                        : "bg-blue-100 text-blue-600"
                                } flex items-center justify-center text-xs sm:text-sm mr-1.5 sm:mr-2`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                {index + 1}
                            </motion.span>
                            <span
                                className={`flex-1 ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                                {hint.text}
                            </span>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </motion.div>
    );
};

export default HintsList;
