import React, { useEffect, useState } from "react";
import fetchPokemonData from "./components/fetchRandomPokemon";
import "./index.css"; // optional if using Tailwind or custom CSS

const attributes = ["name", "generation", "type1", "type2", "color", "habitat"];

const App = () => {
    const [targetPokemon, setTargetPokemon] = useState(null);
    const [guess, setGuess] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [win, setWin] = useState(false);

    useEffect(() => {
        const fetchTarget = async () => {
            const id = Math.floor(Math.random() * 1010) + 1;
            const pokemon = await fetchPokemonData(id);
            setTargetPokemon(pokemon);
        };

        fetchTarget();
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
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">PokéWordle</h1>

            <div className="flex mb-4">
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="border p-2 rounded-l-md"
                    placeholder="Enter Pokémon name"
                />
                <button
                    onClick={handleGuess}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                >
                    Guess
                </button>
            </div>

            <div className="grid grid-cols-6 gap-2 font-medium text-center text-white">
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
