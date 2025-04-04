import React, { useEffect, useState, useCallback, memo } from "react";
import fetchPokemonData from "./components/fetchRandomPokemon";
import axios from "axios";

const attributes = ["name", "generation", "type1", "type2", "color", "habitat"];

// Memoized components for better performance
const GuessInput = memo(({ guess, onChange, onSelect, filteredPokemon }) => (
    <div className="relative w-full max-w-md">
        <input
            type="text"
            value={guess}
            onChange={onChange}
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Enter Pokémon name..."
        />
        {filteredPokemon.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border-2 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                {filteredPokemon.map((name, i) => (
                    <li
                        key={i}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer capitalize transition-colors"
                        onClick={() => onSelect(name)}
                    >
                        {name}
                    </li>
                ))}
            </ul>
        )}
    </div>
));

const GuessButton = memo(({ onClick }) => (
    <button
        onClick={onClick}
        className="w-full max-w-md mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors transform hover:scale-105 active:scale-95"
    >
        Make a Guess
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
            const id = Math.floor(Math.random() * 1010) + 1;
            const pokemon = await fetchPokemonData(id);
            console.log(pokemon);
            setTargetPokemon(pokemon);
        };

        const fetchAllPokemonNames = async () => {
            const res = await axios.get(
                "https://pokeapi.co/api/v2/pokemon?limit=1010"
            );
            const names = res.data.results.map((p) => p.name);
            setAllPokemon(names);
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

        const isCorrect = attributes.every(
            (attr) => guessed[attr] === targetPokemon[attr]
        );
        if (isCorrect) setWin(true);

        setGuesses([...guesses, guessed]);
        setGuess("");
        setFilteredPokemon([]);
    };

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
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800 drop-shadow-sm">
                    <span className="text-blue-600">Poké</span>Wordle
                </h1>

                <div className="flex flex-col items-center space-y-6">
                    <GuessInput
                        guess={guess}
                        onChange={handleInputChange}
                        onSelect={handleSelect}
                        filteredPokemon={filteredPokemon}
                    />
                    <GuessButton onClick={handleGuess} />

                    <div className="w-full bg-white rounded-xl shadow-lg p-6 mt-8">
                        <div className="grid grid-cols-6 gap-3">
                            {[
                                "Name",
                                "Gen",
                                "Type 1",
                                "Type 2",
                                "Color",
                                "Habitat",
                            ].map((h, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                >
                                    {h}
                                </div>
                            ))}
                            {guesses.map((g, idx) =>
                                attributes.map((attr, i) => {
                                    const correct =
                                        g[attr] === targetPokemon[attr];
                                    return (
                                        <div
                                            key={`${idx}-${i}`}
                                            className={`p-2 rounded-lg font-medium text-white transition-all ${
                                                correct
                                                    ? "bg-green-500 animate-pulse"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {g[attr] || "—"}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {win && (
                        <div className="mt-6 text-2xl font-bold text-green-600 animate-bounce">
                            🎉 Congratulations! You found{" "}
                            {targetPokemon.name.toUpperCase()}! 🎉
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
