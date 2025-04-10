import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import fetchPokemonData from "../components/fetchRandomPokemon";
import { attributes } from "../utils/pokemonUtils";
import { capitalize } from "../utils/stringUtils";

const usePokeGame = () => {
    const [targetPokemon, setTargetPokemon] = useState(null);
    const [guess, setGuess] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [win, setWin] = useState(false);
    const [allPokemon, setAllPokemon] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [hints, setHints] = useState([]);
    const [hintsLeft, setHintsLeft] = useState(3);
    const [showGiveUpModal, setShowGiveUpModal] = useState(false);
    const [hasGivenUp, setHasGivenUp] = useState(false);
    const [showNewBattleButton, setShowNewBattleButton] = useState(false);

    useEffect(() => {
        const fetchTarget = async () => {
            try {
                const id = Math.floor(Math.random() * 1010) + 1;
                const pokemon = await fetchPokemonData(id);
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
        if (win || !guess.trim() || hasGivenUp) return;

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
            setHasGivenUp(false);
            setShowNewBattleButton(false);
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
            } else if (randomAttr === "type1") {
                hintText = `The Pokémon's primary type is ${capitalize(value)}`;
            } else if (randomAttr === "type2" && value !== "—") {
                hintText = `The Pokémon's secondary type is ${capitalize(
                    value
                )}`;
            } else if (randomAttr === "color") {
                hintText = `The Pokémon's color is ${capitalize(value)}`;
            } else if (
                randomAttr === "habitat" &&
                value.toLowerCase() !== "unknown"
            ) {
                hintText = `The Pokémon's habitat is ${capitalize(value)}`;
            } else {
                // Skip this hint if it's not useful (like type2="—" or habitat="unknown")
                // and try again
                setHintsLeft(hintsLeft);
                handleHint();
                return;
            }

            setHints([
                ...hints,
                {
                    attribute: randomAttr,
                    text: hintText,
                    value: value, // Store the actual value for comparison
                },
            ]);
            setHintsLeft(hintsLeft - 1);
        } else {
            alert("No more hints available for this Pokémon!");
        }
    }, [targetPokemon, hints, hintsLeft]);

    const handleInputChange = useCallback(
        (e) => {
            const inputValue = e.target.value;
            const lowerCaseValue = inputValue.toLowerCase();

            // Set the display value as-is (preserving case)
            setGuess(inputValue);

            if (lowerCaseValue.length === 0) {
                setFilteredPokemon([]);
            } else {
                const filtered = allPokemon
                    .filter((p) => p.startsWith(lowerCaseValue))
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

    const handleGiveUp = useCallback(() => {
        setShowGiveUpModal(true);
        setHasGivenUp(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowGiveUpModal(false);
        setShowNewBattleButton(true);
    }, []);

    return {
        targetPokemon,
        guess,
        guesses,
        win,
        filteredPokemon,
        hints,
        hintsLeft,
        showGiveUpModal,
        hasGivenUp,
        showNewBattleButton,
        handleGuess,
        handleReset,
        handleHint,
        handleInputChange,
        handleSelect,
        handleGiveUp,
        closeModal,
    };
};

export default usePokeGame;
