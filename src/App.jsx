import React, { useEffect, useState, useCallback, memo } from "react";
import fetchPokemonData from "./components/fetchRandomPokemon";
import axios from "axios";

const attributes = [
    "image",
    "name",
    "generation",
    "type1",
    "type2",
    "color",
    "habitat",
];
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "—");

const getPokemonId = (name) => {
    // Create a map of special cases if needed
    const specialCases = {
        "nidoran-f": 29,
        "nidoran-m": 32,
        // Add more special cases as needed
    };

    if (specialCases[name]) return specialCases[name];

    // For regular Pokemon, fetch their ID from your existing data
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    return fetch(url)
        .then((res) => res.json())
        .then((data) => data.id)
        .catch(() => null);
};

// Memoized components for better performance
const GuessInput = memo(({ guess, onChange, onSelect, filteredPokemon }) => {
    const [pokemonImages, setPokemonImages] = useState({});

    useEffect(() => {
        // Fetch Pokemon IDs for all filtered Pokemon
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
        <div className="relative w-full max-w-md px-4 sm:px-0">
            <input
                type="text"
                value={guess}
                onChange={onChange}
                className="w-full p-2 sm:p-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors text-sm sm:text-base"
                placeholder="Who's that Pokémon...?"
            />
            {filteredPokemon.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border-2 border-red-200 rounded-lg shadow-lg max-h-40 sm:max-h-48 overflow-y-auto mt-1">
                    {filteredPokemon.map((name, i) => (
                        <li
                            key={i}
                            className="px-4 py-3 sm:px-5 sm:py-4 hover:bg-blue-50 cursor-pointer transition-colors text-sm sm:text-base flex items-center gap-3" // Adjusted padding and gap
                            onClick={() => onSelect(capitalize(name))}
                        >
                            {pokemonImages[name] && (
                                <img
                                    src={pokemonImages[name]}
                                    alt={name}
                                    className="w-12 h-12 object-contain" // Changed from w-8 h-8
                                />
                            )}
                            <span className="capitalize">{name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});

const GuessButton = memo(({ onClick }) => (
    <button
        onClick={onClick}
        className="w-full max-w-md mt-2 sm:mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors transform hover:scale-105 active:scale-95 text-sm sm:text-base"
    >
        Catch 'em!
    </button>
));

const ResetButton = memo(({ onClick }) => (
    <button
        onClick={onClick}
        className="w-full max-w-md mt-2 sm:mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors transform hover:scale-105 active:scale-95 text-sm sm:text-base"
    >
        New Battle!
    </button>
));

const App = () => {
    const [targetPokemon, setTargetPokemon] = useState(null);
    const [guess, setGuess] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [win, setWin] = useState(false);
    const [allPokemon, setAllPokemon] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);

    useEffect(() => {
        const fetchTarget = async () => {
            try {
                const id = Math.floor(Math.random() * 1010) + 1;
                const pokemon = await fetchPokemonData(id);
                console.log(pokemon);
                setTargetPokemon(pokemon);
            } catch (error) {
                console.error("Error fetching target Pokemon:", error);
            }
        };

        const fetchAllPokemonNames = async () => {
            try {
                const res = await axios.get(
                    "https://pokeapi.co/api/v2/pokemon?limit=1010"
                );
                const names = res.data.results.map((p) => p.name);
                setAllPokemon(names);
            } catch (error) {
                console.error("Error fetching Pokemon names:", error);
            }
        };

        fetchTarget();
        fetchAllPokemonNames();
    }, []);

    const handleGuess = async () => {
        if (win || !guess.trim()) return;

        const guessed = await fetchPokemonData(guess.trim().toLowerCase());
        if (!guessed) {
            alert("Invalid Pokémon name!");
            return;
        }

        // Check if Pokemon was already guessed
        const isDuplicate = guesses.some((g) => g.name === guessed.name);
        if (isDuplicate) {
            alert("You've already guessed this Pokémon!");
            setGuess("");
            setFilteredPokemon([]);
            return;
        }

        const isCorrect = attributes.every(
            (attr) => guessed[attr] === targetPokemon[attr]
        );
        if (isCorrect) setWin(true);

        setGuesses([...guesses, guessed]);
        setGuess("");
        setFilteredPokemon([]);
    };

    const handleReset = useCallback(async () => {
        try {
            const id = Math.floor(Math.random() * 1010) + 1;
            const pokemon = await fetchPokemonData(id);
            setTargetPokemon(pokemon);
            setGuess("");
            setGuesses([]);
            setWin(false);
            setFilteredPokemon([]);
        } catch (error) {
            console.error("Error resetting game:", error);
        }
    }, []);

    const handleInputChange = useCallback(
        (e) => {
            const val = e.target.value.toLowerCase();
            setGuess(val);
            if (val.length === 0) {
                setFilteredPokemon([]);
            } else {
                const filtered = allPokemon
                    .filter((p) => p.startsWith(val))
                    .slice(0, 8);
                setFilteredPokemon(filtered);
            }
        },
        [allPokemon]
    );

    const handleSelect = useCallback((name) => {
        setGuess(name);
        setFilteredPokemon([]);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-100 to-red-200 px-4 py-6 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8 font- text-gray-800 drop-shadow-sm">
                    <span className="text-red-600">Poké</span>Guess
                </h1>

                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                    <GuessInput
                        guess={guess}
                        onChange={handleInputChange}
                        onSelect={handleSelect}
                        filteredPokemon={filteredPokemon}
                    />
                    <GuessButton onClick={handleGuess} />

                    <div className="w-full bg-white rounded-xl shadow-lg p-3 sm:p-6 mt-4 sm:mt-8 overflow-x-auto border-4 border-red-300">
                        <div className="grid grid-cols-7 gap-2 sm:gap-3 min-w-[700px]">
                            {[
                                "Image",
                                "Name",
                                "Gen",
                                "Type 1",
                                "Type 2",
                                "Color",
                                "Habitat",
                            ].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-extrabold"
                                >
                                    {h.toUpperCase()}
                                </div>
                            ))}
                            {guesses.map((g, idx) =>
                                attributes.map((attr, i) => {
                                    const correct =
                                        g[attr] === targetPokemon[attr];
                                    if (attr === "image") {
                                        return (
                                            <div
                                                key={`${idx}-${i}`}
                                                className={`rounded-lg flex items-center justify-center p-2 ${
                                                    correct
                                                        ? "bg-emerald-500"
                                                        : "bg-red-500"
                                                }`} // Added padding
                                            >
                                                <img
                                                    src={
                                                        g.sprites.front_default
                                                    }
                                                    alt={g.name}
                                                    className="w-16 h-16 object-contain" // Changed from w-12 h-12
                                                />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            key={`${idx}-${i}`}
                                            className={`flex items-center justify-center p-1 sm:p-2 rounded-lg font-medium text-white transition-all text-xs sm:text-sm text-center ${
                                                correct
                                                    ? "bg-emerald-500 animate-pulse"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {attr === "type1" ||
                                            attr === "type2" ||
                                            attr === "color" ||
                                            attr === "habitat" // Add habitat to the list of attributes to capitalize
                                                ? capitalize(g[attr])
                                                : attr === "name"
                                                ? capitalize(g[attr])
                                                : g[attr] || "—"}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {win && (
                        <>
                            <div className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-red-600 animate-bounce text-center px-4">
                                You caught {targetPokemon.name.toUpperCase()}!
                            </div>
                            <ResetButton onClick={handleReset} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
