import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { capitalize } from "../../utils/stringUtils";

const UniversalModal = ({
    targetPokemon,
    onClose,
    onNewGame,
    theme,
    titleText,
    accentColor,
    buttonColor,
    shouldAnimate = true,
    guessCount,
}) => {
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
        exit: {
            opacity: 0,
            scale: 0.9,
            y: -30,
            transition: {
                duration: 0.2,
            },
        },
    };

    const colorMap = {
        green: {
            border: isDark ? "border-green-600" : "border-green-500",
            text: isDark ? "text-green-400" : "text-green-600",
            label: isDark ? "text-green-300" : "text-green-600",
            glow: isDark ? "bg-green-700/30" : "bg-green-100/50",
            button: "bg-green-500 hover:bg-green-600",
        },
        red: {
            border: isDark ? "border-red-600" : "border-red-500",
            text: isDark ? "text-red-400" : "text-red-600",
            label: isDark ? "text-red-300" : "text-red-600",
            glow: isDark ? "bg-red-700/30" : "bg-red-100/50",
            button: "bg-red-500 hover:bg-red-600",
        },
        blue: {
            border: isDark ? "border-blue-600" : "border-blue-500",
            text: isDark ? "text-blue-400" : "text-blue-600",
            label: isDark ? "text-blue-300" : "text-blue-600",
            glow: isDark ? "bg-blue-700/30" : "bg-blue-100/50",
            button: "bg-blue-500 hover:bg-blue-600",
        },
    };

    const colors = colorMap[accentColor] || colorMap.green;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="fixed inset-0 bg-black/50 flex items-center backdrop-blur-xs justify-center z-50 px-4 py-5"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                key="modal-backdrop"
            >
                <motion.div
                    className={`${
                        isDark ? "bg-gray-900" : "bg-white"
                    } rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto shadow-2xl border-2 ${
                        colors.border
                    }`}
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key="modal-content"
                >
                    <div className="text-center">
                        <h3
                            className={`text-lg sm:text-xl font-bold mb-3 ${
                                isDark ? "text-gray-100" : "text-gray-800"
                            }`}
                        >
                            {titleText}
                        </h3>
                        <div className="relative">
                            <motion.div
                                className="w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-4 sm:mb-5 relative z-10"
                                initial={
                                    shouldAnimate
                                        ? { scale: 0.5, opacity: 0 }
                                        : { scale: 1, opacity: 1 }
                                }
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                whileHover={{
                                    scale: 1.1,
                                    rotate: [0, 5, -5, 0],
                                }}
                            >
                                <img
                                    src={targetPokemon.image}
                                    alt={targetPokemon.name}
                                    className="w-full h-full object-contain drop-shadow-lg"
                                />
                            </motion.div>

                            <motion.div
                                className={`absolute inset-0 rounded-full ${colors.glow} blur-xl -z-0`}
                                initial={
                                    shouldAnimate
                                        ? { scale: 0, opacity: 0 }
                                        : { scale: 1.2, opacity: 0.7 }
                                }
                                animate={{ scale: 1.2, opacity: 0.7 }}
                                transition={{ delay: 0.3, duration: 0.7 }}
                            />
                        </div>
                        <motion.p
                            className={`text-xl sm:text-2xl font-bold ${colors.text} mb-2 sm:mb-3`}
                            initial={
                                shouldAnimate ? { opacity: 0 } : { opacity: 1 }
                            }
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {capitalize(targetPokemon.name)}
                        </motion.p>
                        {guessCount !== undefined && (
                            <motion.div
                                className="mb-3 sm:mb-4 text-center"
                                initial={
                                    shouldAnimate
                                        ? { y: 10, opacity: 0 }
                                        : { y: 0, opacity: 1 }
                                }
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <span
                                    className={`text-sm ${
                                        isDark
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {accentColor === "green"
                                        ? `Caught in ${guessCount} ${
                                              guessCount === 1
                                                  ? "guess"
                                                  : "guesses"
                                          }!`
                                        : `After ${guessCount} ${
                                              guessCount === 1
                                                  ? "guess"
                                                  : "guesses"
                                          }`}
                                </span>
                            </motion.div>
                        )}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6 text-xs sm:text-sm">
                            <motion.div
                                className={`${
                                    isDark ? "bg-gray-700" : "bg-gray-100"
                                } rounded-full p-3 text-center shadow-sm ${
                                    isDark
                                        ? "shadow-black/20"
                                        : "shadow-gray-200"
                                }`}
                                initial={
                                    shouldAnimate
                                        ? { x: -20, opacity: 0 }
                                        : { x: 0, opacity: 1 }
                                }
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className={`font-medium ${colors.label}`}>
                                    Type:
                                </span>{" "}
                                <span
                                    className={
                                        isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }
                                >
                                    {capitalize(targetPokemon.type1)}
                                    {targetPokemon.type2 !== "—"
                                        ? `/${capitalize(targetPokemon.type2)}`
                                        : ""}
                                </span>
                            </motion.div>
                            <motion.div
                                className={`${
                                    isDark ? "bg-gray-700" : "bg-gray-100"
                                } rounded-full p-3 text-center shadow-sm ${
                                    isDark
                                        ? "shadow-black/20"
                                        : "shadow-gray-200"
                                }`}
                                initial={
                                    shouldAnimate
                                        ? { x: 20, opacity: 0 }
                                        : { x: 0, opacity: 1 }
                                }
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className={`font-medium ${colors.label}`}>
                                    Gen:
                                </span>{" "}
                                <span
                                    className={
                                        isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }
                                >
                                    {targetPokemon.generation}
                                </span>
                            </motion.div>
                            <motion.div
                                className={`${
                                    isDark ? "bg-gray-700" : "bg-gray-100"
                                } rounded-full p-3 text-center shadow-sm ${
                                    isDark
                                        ? "shadow-black/20"
                                        : "shadow-gray-200"
                                }`}
                                initial={
                                    shouldAnimate
                                        ? { x: -20, opacity: 0 }
                                        : { x: 0, opacity: 1 }
                                }
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <span className={`font-medium ${colors.label}`}>
                                    Color:
                                </span>{" "}
                                <span
                                    className={
                                        isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }
                                >
                                    {capitalize(targetPokemon.color)}
                                </span>
                            </motion.div>
                            <motion.div
                                className={`${
                                    isDark ? "bg-gray-700" : "bg-gray-100"
                                } rounded-full p-3 text-center shadow-sm ${
                                    isDark
                                        ? "shadow-black/20"
                                        : "shadow-gray-200"
                                }`}
                                initial={
                                    shouldAnimate
                                        ? { x: 20, opacity: 0 }
                                        : { x: 0, opacity: 1 }
                                }
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <span className={`font-medium ${colors.label}`}>
                                    Habitat:
                                </span>{" "}
                                <span
                                    className={
                                        isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }
                                >
                                    {capitalize(targetPokemon.habitat)}
                                </span>{" "}
                            </motion.div>
                        </div>{" "}
                        <div className="flex gap-3 sm:gap-4">
                            <motion.button
                                onClick={onClose}
                                className={`flex-1 ${
                                    isDark
                                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300"
                                } py-2.5 sm:py-3 px-4 sm:px-5 rounded-full transition-colors text-sm sm:text-base border font-medium shadow-sm`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Close
                            </motion.button>
                            <motion.button
                                onClick={onNewGame}
                                className={`flex-1 ${colors.button} text-white py-2.5 sm:py-3 px-4 sm:px-5 rounded-full transition-colors text-sm sm:text-base font-medium shadow-md`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                New Game
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UniversalModal;
