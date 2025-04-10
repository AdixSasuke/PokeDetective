import React from "react";
import { motion } from "framer-motion";
import { capitalize } from "../../utils/stringUtils";

const GiveUpModal = ({ targetPokemon, onClose, onNewGame, theme }) => {
    if (!targetPokemon) return null;
    const isDark = theme === "dark";

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, y: -50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 22,
            },
        },
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4 py-5"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.div
                className={`${
                    isDark ? "bg-gray-800" : "bg-white"
                } rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto shadow-xl`}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <div className="text-center">
                    <h3
                        className={`text-lg sm:text-xl font-bold mb-2 ${
                            isDark ? "text-gray-100" : "text-gray-800"
                        }`}
                    >
                        The Pokémon was...
                    </h3>
                    <motion.div
                        className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <img
                            src={targetPokemon.image}
                            alt={targetPokemon.name}
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                    <motion.p
                        className="text-xl sm:text-2xl font-bold text-blue-600 mb-3 sm:mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {capitalize(targetPokemon.name)}
                    </motion.p>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-5 sm:mb-6 text-xs sm:text-sm">
                        <motion.div
                            className={`${
                                isDark ? "bg-gray-700" : "bg-gray-100"
                            } rounded-lg p-2 text-left`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="font-medium">Type:</span>{" "}
                            {capitalize(targetPokemon.type1)}
                            {targetPokemon.type2 !== "—"
                                ? `/${capitalize(targetPokemon.type2)}`
                                : ""}
                        </motion.div>
                        <motion.div
                            className={`${
                                isDark ? "bg-gray-700" : "bg-gray-100"
                            } rounded-lg p-2 text-left`}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="font-medium">Generation:</span>{" "}
                            {targetPokemon.generation}
                        </motion.div>
                        <motion.div
                            className={`${
                                isDark ? "bg-gray-700" : "bg-gray-100"
                            } rounded-lg p-2 text-left`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span className="font-medium">Color:</span>{" "}
                            {capitalize(targetPokemon.color)}
                        </motion.div>
                        <motion.div
                            className={`${
                                isDark ? "bg-gray-700" : "bg-gray-100"
                            } rounded-lg p-2 text-left`}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span className="font-medium">Habitat:</span>{" "}
                            {capitalize(targetPokemon.habitat)}
                        </motion.div>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                        <motion.button
                            onClick={onClose}
                            className={`flex-1 ${
                                isDark
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            } py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Close
                        </motion.button>
                        <motion.button
                            onClick={onNewGame}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            New Battle
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GiveUpModal;
