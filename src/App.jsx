import React, { useEffect, useState } from "react";
import fetchPokemonData from "./components/fetchRandomPokemon";
import axios from "axios";

const attributes = ["name", "generation", "type1", "type2", "color", "habitat"];

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

    const handleInputChange = (e) => {
        const val = e.target.value.toLowerCase();
        setGuess(val);
        if (val.length === 0) {
            setFilteredPokemon([]);
        } else {
            const filtered = allPokemon
                .filter((p) => p.startsWith(val))
                .slice(0, 10);
            setFilteredPokemon(filtered);
        }
    };

    const handleSelect = (name) => {
        setGuess(name);
        setFilteredPokemon([]);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">PokéWordle</h1>

            <div className="relative w-80">
                <input
                    type="text"
                    value={guess}
                    onChange={handleInputChange}
                    className="border w-full p-2 rounded-md"
                    placeholder="Enter Pokémon name"
                />
                {filteredPokemon.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border rounded-md shadow max-h-40 overflow-y-auto">
                        {filteredPokemon.map((name, i) => (
                            <li
                                key={i}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer capitalize"
                                onClick={() => handleSelect(name)}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={handleGuess}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                >
                    Guess
                </button>
            </div>

            <div className="grid grid-cols-6 gap-2 font-medium text-center text-white mt-6">
                {["Name", "Gen", "Type 1", "Type 2", "Color", "Habitat"].map(
                    (h, i) => (
                        <div key={i} className="bg-black px-2 py-1 rounded">
                            {h}
                        </div>
                    )
                )}
                {guesses.map((g, idx) =>
                    attributes.map((attr, i) => {
                        const correct = g[attr] === targetPokemon[attr];
                        return (
                            <div
                                key={`${idx}-${i}`}
                                className={`p-2 rounded font-semibold ${
                                    correct ? "bg-green-500" : "bg-red-500"
                                }`}
                            >
                                {g[attr] || "—"}
                            </div>
                        );
                    })
                )}
            </div>

            {win && (
                <div className="mt-6 text-green-600 text-xl font-bold">
                    🎉 You guessed it right! It was{" "}
                    {targetPokemon.name.toUpperCase()}!
                </div>
            )}
        </div>
    );
};

export default App;
