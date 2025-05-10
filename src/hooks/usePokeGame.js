import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import fetchPokemonData from "../components/fetchRandomPokemon";
import { attributes } from "../utils/pokemonUtils";
import { capitalize } from "../utils/stringUtils";
import { preloadPokemonImages, pokemonCache } from "../utils/pokemonImageUtils";

// Debounce function to limit search API calls
const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

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
    const [isLoading, setIsLoading] = useState(true);
    const [isGuessing, setIsGuessing] = useState(false);

    // Preload common Pokémon images
    useEffect(() => {
        // Preload first 151 Pokémon images (Gen 1)
        preloadPokemonImages(151);
    }, []);

    useEffect(() => {
        const fetchTarget = async () => {
            setIsLoading(true);
            try {
                const id = Math.floor(Math.random() * 1010) + 1;
                const pokemon = await fetchPokemonData(id);

                // Validate pokemon data has required properties before setting
                if (pokemon && pokemon.name && pokemon.id) {
                    setTargetPokemon(pokemon);
                } else {
                    console.error("Invalid target Pokemon data:", pokemon);
                    // Try again with a different ID
                    fetchTarget();
                }
            } catch (error) {
                console.error("Error fetching target Pokemon:", error);
            } finally {
                setIsLoading(false);
            }
        };
        const fetchAllPokemonNames = async () => {
            try {
                // Check if we already have this data cached
                const cachedNames = pokemonCache.getSpecial("allNames");
                if (cachedNames) {
                    setAllPokemon(cachedNames);
                    return;
                }
                const res = await axios.get(
                    "https://pokeapi.co/api/v2/pokemon?limit=1010"
                );
                const names = res.data.results.map((p) => p.name);
                setAllPokemon(names);
                // Cache the names for future use - special case for allNames
                pokemonCache.setSpecial("allNames", names);
            } catch (error) {
                console.error("Error fetching Pokemon names:", error);
            }
        };

        fetchTarget();
        fetchAllPokemonNames();
    }, []);

    // Create a memoized and debounced filter function
    const debouncedFilter = useMemo(
        () =>
            debounce((inputValue) => {
                if (!inputValue) {
                    setFilteredPokemon([]);
                    return;
                }
                const lowerCaseValue = inputValue.toLowerCase();
                // Filter Pokémon that START WITH the search term (not just contain it)
                const filtered = allPokemon
                    .filter((p) => p.startsWith(lowerCaseValue))
                    .slice(0, 8);
                setFilteredPokemon(filtered);
            }, 300),
        [allPokemon]
    );
    const handleGuess = async () => {
        // Prevent multiple submissions while guessing or if game is over
        if (win || !guess.trim() || hasGivenUp || isGuessing) return;

        // Set guessing state to true to prevent multiple submissions
        setIsGuessing(true);

        try {
            const guessed = await fetchPokemonData(guess.trim().toLowerCase());

            if (!guessed) {
                alert("Invalid Pokémon name!");
                setIsGuessing(false);
                return;
            } // Ensure guessed has required properties
            if (!guessed || !guessed.name) {
                console.error("Invalid Pokemon data - missing name:", guessed);
                alert("Error fetching Pokémon data. Please try again.");
                setGuess("");
                setIsGuessing(false);
                return;
            }

            // Check if this exact Pokémon has been guessed already by comparing names
            const isDuplicate = guesses.some(
                (g) =>
                    g &&
                    g.name &&
                    g.name.toLowerCase() === guessed.name.toLowerCase()
            );
            if (isDuplicate) {
                alert("You've already guessed this Pokémon!");
                setGuess("");
                setFilteredPokemon([]);
                return;
            }

            // Check if the guess matches the target Pokémon
            const isCorrect =
                targetPokemon &&
                targetPokemon.name &&
                guessed.name &&
                guessed.name.toLowerCase() === targetPokemon.name.toLowerCase();
            if (isCorrect) setWin(true); // Ensure all required data is present before adding the guess
            if (guessed && guessed.name && guessed.image) {
                setGuesses((prevGuesses) => [...prevGuesses, guessed]);
            } else {
                console.error("Invalid Pokemon data for guess:", guessed);
            }
            setGuess("");
            setFilteredPokemon([]);
        } catch (error) {
            console.error("Error in handleGuess:", error);
            alert("An error occurred. Please try again.");
            setGuess("");
        } finally {
            // Make sure isGuessing is reset to false regardless of success or failure
            setIsGuessing(false);
        }
    };
    const handleReset = useCallback(async () => {
        // Prevent reset while already guessing
        if (isGuessing) return;

        // Set loading state
        setIsLoading(true);

        try {
            const id = Math.floor(Math.random() * 1010) + 1;
            const pokemon = await fetchPokemonData(id);

            // Validate pokemon data has required properties before setting
            if (pokemon && pokemon.name && pokemon.id) {
                setTargetPokemon(pokemon);
                setGuess("");
                setGuesses([]);
                setWin(false);
                setFilteredPokemon([]);
                setHints([]);
                setHintsLeft(3);
                setHasGivenUp(false);
                setShowNewBattleButton(false);
                setIsGuessing(false); // Make sure guessing state is reset
            } else {
                console.error(
                    "Invalid target Pokemon data during reset:",
                    pokemon
                );
                // Try the reset again
                handleReset();
            }
        } catch (error) {
            console.error("Error resetting game:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isGuessing]);

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
                setHintsLeft(hintsLeft);
                handleHint();
                return;
            }

            setHints([
                ...hints,
                {
                    attribute: randomAttr,
                    text: hintText,
                    value: value,
                },
            ]);
            setHintsLeft(hintsLeft - 1);
        } else {
            alert("No more hints available for this Pokémon!");
        }
    }, [targetPokemon, hints, hintsLeft]);
    const handleInputChange = useCallback(
        (e) => {
            // Prevent input changes while already guessing
            if (isGuessing) return;

            const inputValue = e.target.value;
            setGuess(inputValue);
            debouncedFilter(inputValue);
        },
        [debouncedFilter, isGuessing]
    );
    const handleSelect = useCallback(
        (name) => {
            // Prevent selection while already guessing
            if (isGuessing) return;

            setGuess(name);
            setFilteredPokemon([]);
        },
        [isGuessing]
    );

    const handleGiveUp = useCallback(() => {
        setShowGiveUpModal(true);
        setHasGivenUp(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowGiveUpModal(false);

        if (win) {
            setWin(false);
        }

        setShowNewBattleButton(true);
    }, [win]);
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
        isLoading,
        isGuessing,
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
