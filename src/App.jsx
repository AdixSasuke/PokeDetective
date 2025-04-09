"use client";

import { useEffect, useState, useCallback, memo } from "react";
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
    const specialCases = {
        "nidoran-f": 29,
        "nidoran-m": 32,
    };

    if (specialCases[name]) return specialCases[name];

    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    return fetch(url)
        .then((res) => res.json())
        .then((data) => data.id)
        .catch(() => null);
};

const GuessInput = memo(({ guess, onChange, onSelect, filteredPokemon }) => {
    const [pokemonImages, setPokemonImages] = useState({});

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
                    className="w-full p-3 sm:p-4 rounded-full border-2 border-gray-200 focus:border-red-400 focus:outline-none transition-all text-base shadow-sm pl-5 pr-12"
                    placeholder="Who's that Pokémon...?"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 sm:max-h-56 overflow-y-auto mt-1">
                    {filteredPokemon.map((name, i) => (
                        <li
                            key={i}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors text-base flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                            onClick={() => onSelect(capitalize(name))}
                        >
                            {pokemonImages[name] && (
                                <img
                                    src={
                                        pokemonImages[name] ||
                                        "/placeholder.svg"
                                    }
                                    alt={name}
                                    className="w-10 h-10 object-contain"
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
});

const GuessButton = memo(({ onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-full transition-colors w-full"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        Catch 'em!
    </button>
));

const HintButton = memo(({ onClick, hintsLeft }) => (
    <button
        onClick={onClick}
        disabled={hintsLeft <= 0}
        className={`flex items-center justify-center gap-2 font-medium py-3 px-6 rounded-full transition-colors w-full ${
            hintsLeft > 0
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
            />
        </svg>
        {hintsLeft > 0 ? `${hintsLeft} Hints Left` : "No Hints Left"}
    </button>
));

const ResetButton = memo(({ onClick }) => (
    <button
        onClick={onClick}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-colors mx-auto block"
    >
        New Battle
    </button>
));

const App = () => {
    const [targetPokemon, setTargetPokemon] = useState(null);
    const [guess, setGuess] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [win, setWin] = useState(false);
    const [allPokemon, setAllPokemon] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [hints, setHints] = useState([]);
    const [hintsLeft, setHintsLeft] = useState(3);

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
            setHints([]);
            setHintsLeft(3);
        } catch (error) {
            console.error("Error resetting game:", error);
        }
    }, []);

    const handleHint = useCallback(() => {
        if (!targetPokemon || hintsLeft <= 0) return;

        const validAttributes = attributes.filter((attr) => {
            if (attr === "image") return false;

            const value = targetPokemon[attr];
            if (
                !value ||
                value === "—" ||
                value === "-" ||
                value.toLowerCase() === "unknown"
            )
                return false;

            return !hints.some((hint) => hint.attribute === attr);
        });

        if (validAttributes.length > 0) {
            const randomAttr =
                validAttributes[
                    Math.floor(Math.random() * validAttributes.length)
                ];
            const value = targetPokemon[randomAttr];

            let hintText;
            if (randomAttr === "name") {
                hintText = `The Pokémon's name starts with "${value
                    .charAt(0)
                    .toUpperCase()}"`;
            } else if (randomAttr === "generation") {
                hintText = `The Pokémon is from Generation ${value}`;
            } else if (randomAttr === "type1" || randomAttr === "type2") {
                const typeNumber =
                    randomAttr === "type1" ? "primary" : "secondary";
                hintText = `The Pokémon's ${typeNumber} type is ${capitalize(
                    value
                )}`;
            } else if (randomAttr === "color") {
                hintText = `The Pokémon's color is ${capitalize(value)}`;
            } else if (randomAttr === "habitat") {
                hintText = `The Pokémon's habitat is ${capitalize(value)}`;
            } else {
                hintText = `${randomAttr}: ${capitalize(value)}`;
            }

            setHints([...hints, { attribute: randomAttr, text: hintText }]);
            setHintsLeft(hintsLeft - 1);
        } else {
            alert("No more hints available for this Pokémon!");
        }
    }, [targetPokemon, hints, hintsLeft]);

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
        <div className="min-h-screen bg-white px-4 py-8 sm:p-8">
            <div
                className="max-w-3xl mx-auto"
                style={{
                    backgroundImage:
                        "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23FF5A5F' strokeWidth='1' fill='none' strokeOpacity='0.1'/%3E%3C/svg%3E')",
                    backgroundSize: "200px 200px",
                }}
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 mb-2">
                        <img src="https://www.pikpng.com/pngl/b/494-4945371_pokeball-sprite-png.png" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-center mb-2">
                        <span className="text-red-500">Poké</span>
                        <span className="text-gray-800">Guess</span>
                    </h1>
                    <p className="text-gray-600 text-center max-w-lg">
                        Guess the hidden Pokémon! Compare stats to find the
                        answer.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-5 max-w-md mx-auto">
                    <GuessInput
                        guess={guess}
                        onChange={handleInputChange}
                        onSelect={handleSelect}
                        filteredPokemon={filteredPokemon}
                    />

                    <div className="w-full grid grid-cols-2 gap-4">
                        <GuessButton onClick={handleGuess} />
                        <HintButton
                            onClick={handleHint}
                            hintsLeft={hintsLeft}
                        />
                    </div>

                    {hints.length > 0 && (
                        <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <h3 className="font-medium text-blue-600 mb-3 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
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
                            <ul className="space-y-2">
                                {hints.map((hint, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700">
                                            {hint.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {guesses.length > 0 && (
                    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm mt-8 overflow-hidden">
                        <div className="grid grid-cols-7 gap-px bg-gray-100">
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
                                    className="bg-blue-500 text-white px-3 py-3 text-center font-medium"
                                >
                                    {h}
                                </div>
                            ))}

                            {guesses.map((g, idx) =>
                                attributes.map((attr, i) => {
                                    if (attr === "image") {
                                        return (
                                            <div
                                                key={`${idx}-${i}`}
                                                className="bg-red-500 flex items-center justify-center p-2"
                                            >
                                                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center">
                                                    <img
                                                        src={
                                                            g.sprites
                                                                .front_default ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={g.name}
                                                        className="w-14 h-14 object-contain"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Map attribute names to colors
                                    const cellColors = {
                                        name: "bg-red-500 text-white",
                                        generation: "bg-red-500 text-white",
                                        type1: "bg-blue-600 text-white",
                                        type2: "bg-blue-400 text-white",
                                        color: "bg-green-500 text-white",
                                        habitat: "bg-red-500 text-white",
                                    };

                                    // Use a consistent color instead of the mapped colors
                                    const cellColor = "bg-red-500 text-white";

                                    return (
                                        <div
                                            key={`${idx}-${i}`}
                                            className={`${cellColor} flex items-center justify-center p-3 text-center font-medium`}
                                        >
                                            {attr === "type1" ||
                                            attr === "type2" ||
                                            attr === "color" ||
                                            attr === "habitat"
                                                ? capitalize(g[attr])
                                                : attr === "name"
                                                ? capitalize(g[attr])
                                                : g[attr] || "—"}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="text-center text-gray-500 py-3 text-sm">
                            {guesses.length}{" "}
                            {guesses.length === 1 ? "guess" : "guesses"} so far
                        </div>
                    </div>
                )}

                {win && (
                    <>
                        <div className="mt-6 text-xl font-bold text-center px-4 py-3 bg-green-100 border border-green-300 rounded-xl">
                            <span className="text-green-600">
                                Congratulations!
                            </span>{" "}
                            You caught{" "}
                            <span className="text-blue-600">
                                {targetPokemon.name.toUpperCase()}!
                            </span>
                        </div>
                        <ResetButton onClick={handleReset} />
                    </>
                )}
            </div>
        </div>
    );
};

export default App;
