import { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getPokemonIdFromName,
    getPokemonImageUrl,
} from "../../utils/pokemonImageUtils";
import { capitalize } from "../../utils/stringUtils";
import { toRgbColor } from "../../utils/colorUtils";
import PokemonImage from "./PokemonImage";

const GuessInput = memo(
    ({ guess, onChange, onSelect, filteredPokemon, disabled, theme }) => {
        const [pokemonImages, setPokemonImages] = useState({});
        const [loadingImages, setLoadingImages] = useState(false);
        const isDark = theme === "dark";

        useEffect(() => {
            const fetchPokemonImages = async () => {
                if (filteredPokemon.length === 0) return;

                setLoadingImages(true);
                const newImages = {};

                try {
                    // Process in parallel for faster loading
                    await Promise.all(
                        filteredPokemon.map(async (name) => {
                            const id = await getPokemonIdFromName(name);
                            if (id) {
                                newImages[name] = getPokemonImageUrl(id);
                            }
                        })
                    );

                    setPokemonImages(newImages);
                } catch (error) {
                    console.error("Error fetching Pokemon images:", error);
                } finally {
                    setLoadingImages(false);
                }
            };

            fetchPokemonImages();
        }, [filteredPokemon]);

        return (
            <motion.div
                className="relative w-full max-w-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <label htmlFor="pokemon-guess" className="sr-only">
                    Enter Pokémon name
                </label>
                <div className="relative">
                    <motion.input
                        type="text"
                        id="pokemon-guess"
                        value={guess}
                        onChange={(e) => {
                            // Preserve capitalization in the input field
                            onChange(e);
                        }}
                        className="w-full p-2.5 sm:p-3 md:p-4 rounded-full border-2 border-gray-200 focus:border-red-400 focus:outline-none transition-all text-sm sm:text-base shadow-sm pl-4 sm:pl-5 pr-10 sm:pr-12 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Who's that Pokémon...?"
                        disabled={disabled}
                        autoComplete="off"
                        aria-label="Enter Pokémon name to guess"
                        aria-autocomplete="list"
                        aria-controls={
                            filteredPokemon.length > 0
                                ? "pokemon-suggestions"
                                : undefined
                        }
                        aria-expanded={filteredPokemon.length > 0}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    />
                    <motion.div
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        animate={{
                            opacity: [0.6, 1, 0.6],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                        }}
                        aria-hidden="true"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 sm:h-6 sm:w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </motion.div>
                </div>
                <AnimatePresence>
                    {filteredPokemon.length > 0 && (
                        <motion.ul
                            id="pokemon-suggestions"
                            className="absolute z-10 w-full border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-40 sm:max-h-48 overflow-y-auto mt-1"
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ duration: 0.2 }}
                            role="listbox"
                            aria-label="Pokémon suggestions"
                        >
                            {filteredPokemon.map((name, i) => (
                                <motion.li
                                    key={i}
                                    style={
                                        !isDark
                                            ? {
                                                  backgroundColor:
                                                      toRgbColor(
                                                          "rgb(255, 255, 255)"
                                                      ),
                                                  color: toRgbColor(
                                                      "rgb(0, 0, 0)"
                                                  ),
                                              }
                                            : undefined
                                    }
                                    className={`px-3 sm:px-4 py-2 sm:py-3 ${
                                        isDark
                                            ? "bg-gray-800 text-gray-200"
                                            : ""
                                    } cursor-pointer text-sm sm:text-base flex items-center gap-2 sm:gap-3 border-b ${
                                        isDark
                                            ? "border-gray-700"
                                            : "border-gray-100"
                                    } last:border-b-0`}
                                    onClick={() => onSelect(capitalize(name))}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{
                                        backgroundColor: toRgbColor(
                                            isDark
                                                ? "rgb(55, 65, 81)"
                                                : "rgb(243, 244, 246)"
                                        ),
                                    }}
                                    role="option"
                                    aria-selected={name === guess.toLowerCase()}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            onSelect(capitalize(name));
                                        }
                                    }}
                                >
                                    {" "}
                                    {pokemonImages[name] ? (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{
                                                delay: i * 0.05 + 0.1,
                                            }}
                                        >
                                            {" "}
                                            <PokemonImage
                                                src={
                                                    pokemonImages[name] || null
                                                }
                                                name={name}
                                                size="md"
                                                className="object-contain"
                                            />
                                        </motion.div>
                                    ) : (
                                        <div className="w-12 h-12 sm:w-15 sm:h-15 flex items-center justify-center">
                                            {" "}
                                            <PokemonImage
                                                src={null}
                                                name={name}
                                                size="md"
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    <span className="capitalize font-medium">
                                        {name}
                                    </span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }
);

export default GuessInput;
