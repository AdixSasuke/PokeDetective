import { useEffect, useState, memo } from "react";
import { getPokemonId } from "../../utils/pokemonUtils";

const GuessInput = memo(
    ({ guess, onChange, onSelect, filteredPokemon, disabled, theme }) => {
        const [pokemonImages, setPokemonImages] = useState({});
        const isDark = theme === "dark";

        useEffect(() => {
            const fetchPokemonIds = async () => {
                const newImages = {};
                for (const name of filteredPokemon) {
                    const id = await getPokemonId(name);
                    if (id) {
                        newImages[
                            name
                        ] = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                    }
                }
                setPokemonImages(newImages);
            };

            if (filteredPokemon.length > 0) {
                fetchPokemonIds();
            }
        }, [filteredPokemon]);

        return (
            <div className="relative w-full max-w-md">
                <div className="relative">
                    <input
                        type="text"
                        value={guess}
                        onChange={onChange}
                        className="w-full p-2.5 sm:p-3 md:p-4 rounded-full border-2 border-gray-200 focus:border-red-400 focus:outline-none transition-all text-sm sm:text-base shadow-sm pl-4 sm:pl-5 pr-10 sm:pr-12 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Who's that Pokémon...?"
                        disabled={disabled}
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
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
                    </div>
                </div>
                {filteredPokemon.length > 0 && (
                    <ul className="absolute z-10 w-full border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-40 sm:max-h-48 overflow-y-auto mt-1">
                        {filteredPokemon.map((name, i) => (
                            <li
                                key={i}
                                style={
                                    !isDark
                                        ? {
                                              backgroundColor: "white",
                                              color: "black",
                                          }
                                        : undefined
                                }
                                className={`px-3 sm:px-4 py-2 sm:py-3 ${
                                    isDark
                                        ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                                        : "hover:bg-gray-100"
                                } cursor-pointer transition-colors text-sm sm:text-base flex items-center gap-2 sm:gap-3 border-b ${
                                    isDark
                                        ? "border-gray-700"
                                        : "border-gray-100"
                                } last:border-b-0`}
                                onClick={() =>
                                    onSelect(
                                        name.charAt(0).toUpperCase() +
                                            name.slice(1)
                                    )
                                }
                            >
                                {pokemonImages[name] && (
                                    <img
                                        src={
                                            pokemonImages[name] ||
                                            "/placeholder.svg"
                                        }
                                        alt={name}
                                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                                    />
                                )}
                                <span className="capitalize font-medium">
                                    {name}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
);

export default GuessInput;
