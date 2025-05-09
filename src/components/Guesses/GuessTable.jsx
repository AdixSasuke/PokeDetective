import { capitalize } from "../../utils/stringUtils";
import { motion, AnimatePresence } from "framer-motion";
import PokemonImage from "../UI/PokemonImage";
import "../../animations.css";

const attributes = [
    "image",
    "name",
    "generation",
    "type1",
    "type2",
    "color",
    "habitat",
];

const GuessTable = ({ guesses, targetPokemon, theme }) => {
    if (!guesses || guesses.length === 0) return null;

    // Filter out any invalid guesses
    const validGuesses = guesses.filter(
        (guess) => guess && typeof guess === "object" && guess.name
    );

    if (validGuesses.length === 0) return null;

    const isDark = theme === "dark"; // Since the newest guess is at the top (index 0) because the array is reversed in App.jsx
    const newestGuessIndex = 0;

    return (
        <div className="w-full mt-6 sm:mt-8 mx-auto px-4" aria-live="polite">
            <h2 className="sr-only">Your Pokémon Guesses</h2>
            {/* Desktop view - full table */}
            <div
                className={`hidden md:block overflow-hidden rounded-lg ${
                    isDark ? "bg-gray-900" : "bg-white"
                } shadow-lg border ${
                    isDark ? "border-gray-700" : "border-gray-200"
                }`}
                role="table"
                aria-label="Pokémon guesses comparison table"
            >
                {/* Header */}
                <div className="grid grid-cols-7" role="rowgroup">
                    {[
                        "Image",
                        "Name",
                        "Generation",
                        "Type 1",
                        "Type 2",
                        "Color",
                        "Habitat",
                    ].map((header, i) => (
                        <div
                            key={i}
                            className={`py-3 text-center font-semibold text-sm ${
                                isDark
                                    ? "bg-gray-800 text-gray-200"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                            role="columnheader"
                        >
                            {header}
                        </div>
                    ))}
                </div>{" "}
                {/* Rows */}
                <AnimatePresence>
                    <div role="rowgroup">
                        {validGuesses.map((guess, idx) => {
                            // Skip rendering if guess is invalid
                            if (!guess || !guess.name) {
                                return null;
                            }

                            const isNewest = idx === newestGuessIndex;
                            const isCorrect =
                                targetPokemon &&
                                targetPokemon.name &&
                                guess.name &&
                                guess.name.toLowerCase() ===
                                    targetPokemon.name.toLowerCase();

                            // Only apply entry animation to newest guess
                            const initialAnimation = isNewest
                                ? { opacity: 0, y: -20, scale: 0.95 }
                                : { opacity: 1 };

                            return (
                                <motion.div
                                    key={guess.name + idx}
                                    className={`grid grid-cols-7 divide-x ${
                                        isDark
                                            ? "divide-gray-700"
                                            : "divide-gray-200"
                                    } ${isNewest ? "new-guess" : ""}`}
                                    initial={initialAnimation}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25,
                                        duration: isNewest ? 0.5 : 0,
                                    }}
                                    role="row"
                                    aria-label={`Guess: ${capitalize(
                                        guess.name
                                    )}`}
                                >
                                    {attributes.map((attr, i) => {
                                        if (attr === "image") {
                                            const imageBgColor = isCorrect
                                                ? "bg-green-500"
                                                : "bg-red-500";

                                            return (
                                                <div
                                                    key={`${idx}-${i}`}
                                                    className={`flex items-center justify-center p-3 ${imageBgColor}`}
                                                    role="cell"
                                                    aria-label="Pokémon image"
                                                >
                                                    {" "}
                                                    <motion.div
                                                        className="bg-white rounded-lg w-16 h-16 flex items-center justify-center shadow-md"
                                                        initial={
                                                            isNewest
                                                                ? { scale: 0 }
                                                                : { scale: 1 }
                                                        }
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 260,
                                                            damping: 20,
                                                            delay: isNewest
                                                                ? 0.1
                                                                : 0,
                                                        }}
                                                    >
                                                        <PokemonImage
                                                            src={
                                                                guess.image ||
                                                                `/placeholder.svg`
                                                            }
                                                            name={guess.name}
                                                            size="lg"
                                                            className="pokemon-image"
                                                        />
                                                    </motion.div>
                                                </div>
                                            );
                                        } // Determine if this attribute matches with target
                                        const attrMatches =
                                            targetPokemon &&
                                            guess[attr] &&
                                            targetPokemon[attr] &&
                                            guess[attr]
                                                .toString()
                                                .toLowerCase() ===
                                                targetPokemon[attr]
                                                    .toString()
                                                    .toLowerCase();
                                        const cellColor = attrMatches
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white";

                                        // Get readable attribute name
                                        const attrName =
                                            attr === "type1"
                                                ? "Type 1"
                                                : attr === "type2"
                                                ? "Type 2"
                                                : capitalize(attr);

                                        return (
                                            <motion.div
                                                key={`${idx}-${i}`}
                                                className={`flex items-center justify-center p-3 text-center font-medium ${cellColor}`}
                                                initial={
                                                    isNewest
                                                        ? { opacity: 0 }
                                                        : { opacity: 1 }
                                                }
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: isNewest
                                                        ? 0.1 + i * 0.05
                                                        : 0,
                                                }}
                                                role="cell"
                                                aria-label={`${attrName}: ${capitalize(
                                                    guess[attr] || "—"
                                                )}`}
                                                aria-live={
                                                    isNewest ? "polite" : "off"
                                                }
                                                aria-atomic="true"
                                            >
                                                {attr === "type1" ||
                                                attr === "type2" ||
                                                attr === "color" ||
                                                attr === "habitat"
                                                    ? capitalize(guess[attr])
                                                    : attr === "name"
                                                    ? capitalize(guess[attr])
                                                    : guess[attr] || "—"}
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>
            </div>{" "}
            {/* Mobile view - stacked cards */}
            <div className="md:hidden space-y-4">
                <AnimatePresence>
                    {/* Only render newest guess (index 0) with animation */}
                    {validGuesses.length > 0 && (
                        <motion.div
                            key={`newest-${validGuesses[0].name}`}
                            className={`rounded-lg overflow-hidden ${
                                isDark ? "bg-gray-800" : "bg-white"
                            } border-2 ${
                                targetPokemon &&
                                validGuesses[0].name &&
                                targetPokemon.name &&
                                validGuesses[0].name.toLowerCase() ===
                                    targetPokemon.name.toLowerCase()
                                    ? "border-green-500"
                                    : "border-red-500"
                            } shadow-md new-guess`}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                            }}
                            layout
                            role="article"
                            aria-label={`Latest guess: ${capitalize(
                                validGuesses[0].name
                            )}`}
                        >
                            {/* Header */}
                            <div
                                className={`flex items-center gap-3 p-4 ${
                                    targetPokemon &&
                                    validGuesses[0].name &&
                                    targetPokemon.name &&
                                    validGuesses[0].name.toLowerCase() ===
                                        targetPokemon.name.toLowerCase()
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                } text-white`}
                                role="heading"
                                aria-level="3"
                            >
                                <motion.div
                                    className="bg-white rounded-lg p-1 shadow-md"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.1,
                                    }}
                                >
                                    <motion.div
                                        className="rounded-lg w-12 h-12 flex items-center justify-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {" "}
                                        <PokemonImage
                                            src={
                                                validGuesses[0].image ||
                                                `/placeholder.svg`
                                            }
                                            name={validGuesses[0].name}
                                            size="sm"
                                            className="w-10 h-10 object-contain"
                                        />
                                    </motion.div>
                                </motion.div>
                                <motion.h3
                                    className="font-bold text-lg capitalize"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {validGuesses[0].name}
                                </motion.h3>
                            </div>

                            {/* Details */}
                            <div
                                className="grid grid-cols-2 gap-2 p-4"
                                role="list"
                                aria-label="Pokémon attributes"
                            >
                                {" "}
                                {attributes.slice(2).map((attr, i) => {
                                    const attrMatches =
                                        targetPokemon &&
                                        validGuesses[0][attr] &&
                                        targetPokemon[attr] &&
                                        validGuesses[0][attr]
                                            .toString()
                                            .toLowerCase() ===
                                            targetPokemon[attr]
                                                .toString()
                                                .toLowerCase();
                                    const bgColor = attrMatches
                                        ? "bg-green-500"
                                        : "bg-red-500";
                                    const textColor = "text-white";

                                    if (attr === "image") return null;

                                    const label =
                                        attr === "type1"
                                            ? "Type 1"
                                            : attr === "type2"
                                            ? "Type 2"
                                            : capitalize(attr);

                                    return (
                                        <motion.div
                                            key={`mobile-newest-${i}`}
                                            className={`${bgColor} ${textColor} rounded-lg p-3 flex flex-col`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: 0.1 + i * 0.05,
                                            }}
                                            role="listitem"
                                            aria-label={`${label}: ${capitalize(
                                                validGuesses[0][attr] || "—"
                                            )}`}
                                        >
                                            <span className="text-xs text-white/80">
                                                {label}
                                            </span>
                                            <span className="font-medium">
                                                {attr === "type1" ||
                                                attr === "type2" ||
                                                attr === "color" ||
                                                attr === "habitat"
                                                    ? capitalize(
                                                          validGuesses[0][
                                                              attr
                                                          ] || "—"
                                                      )
                                                    : validGuesses[0][attr] ||
                                                      "—"}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>{" "}
                {/* Render all other guesses without animation */}
                {validGuesses.slice(1).map((guess, idx) => {
                    // Skip invalid guesses
                    if (!guess || !guess.name) {
                        return null;
                    }

                    const isCorrect =
                        targetPokemon &&
                        targetPokemon.name &&
                        guess.name &&
                        guess.name.toLowerCase() ===
                            targetPokemon.name.toLowerCase();
                    const cardBorderColor = isCorrect
                        ? "border-green-500"
                        : "border-red-500";

                    return (
                        <div
                            key={`static-${guess.name}-${idx}`}
                            className={`rounded-lg overflow-hidden ${
                                isDark ? "bg-gray-800" : "bg-white"
                            } border-2 ${cardBorderColor} shadow-md`}
                            role="article"
                            aria-label={`Previous guess: ${capitalize(
                                guess.name
                            )}`}
                        >
                            {/* Header */}
                            <div
                                className={`flex items-center gap-3 p-4 ${
                                    isCorrect ? "bg-green-500" : "bg-red-500"
                                } text-white`}
                                role="heading"
                                aria-level="3"
                            >
                                <div className="bg-white rounded-lg p-1 shadow-md">
                                    {" "}
                                    <div className="rounded-lg w-12 h-12 flex items-center justify-center">
                                        <PokemonImage
                                            src={
                                                guess.image ||
                                                `/placeholder.svg`
                                            }
                                            name={guess.name}
                                            size="sm"
                                            className="w-10 h-10 object-contain"
                                        />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg capitalize">
                                    {guess.name}
                                </h3>
                            </div>

                            {/* Details */}
                            <div
                                className="grid grid-cols-2 gap-2 p-4"
                                role="list"
                                aria-label="Pokémon attributes"
                            >
                                {attributes.slice(2).map((attr, i) => {
                                    const attrMatches =
                                        targetPokemon &&
                                        guess[attr] &&
                                        targetPokemon[attr] &&
                                        guess[attr].toString().toLowerCase() ===
                                            targetPokemon[attr]
                                                .toString()
                                                .toLowerCase();
                                    const bgColor = attrMatches
                                        ? "bg-green-500"
                                        : "bg-red-500";
                                    const textColor = "text-white";

                                    if (attr === "image") return null;

                                    const label =
                                        attr === "type1"
                                            ? "Type 1"
                                            : attr === "type2"
                                            ? "Type 2"
                                            : capitalize(attr);

                                    return (
                                        <div
                                            key={`mobile-static-${idx}-${i}`}
                                            className={`${bgColor} ${textColor} rounded-lg p-3 flex flex-col`}
                                            role="listitem"
                                            aria-label={`${label}: ${capitalize(
                                                guess[attr] || "—"
                                            )}`}
                                        >
                                            <span className="text-xs text-white/80">
                                                {label}
                                            </span>
                                            <span className="font-medium">
                                                {" "}
                                                {attr === "type1" ||
                                                attr === "type2" ||
                                                attr === "color" ||
                                                attr === "habitat"
                                                    ? capitalize(
                                                          guess[attr] || "—"
                                                      )
                                                    : guess[attr] || "—"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Footer */}
            <motion.div
                className={`text-center ${
                    isDark ? "text-gray-400" : "text-gray-500"
                } py-3 text-sm rounded-lg ${
                    isDark ? "bg-gray-900" : "bg-white"
                } border-t-0 border ${
                    isDark ? "border-gray-700" : "border-gray-200"
                } shadow-lg`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {validGuesses.length}{" "}
                {validGuesses.length === 1 ? "guess" : "guesses"} so far
            </motion.div>
        </div>
    );
};

export default GuessTable;
