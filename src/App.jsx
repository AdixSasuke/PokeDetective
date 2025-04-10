"use client";

import { memo } from "react";
import GuessInput from "./components/UI/GuessInput";
import {
    GuessButton,
    HintButton,
    ResetButton,
    GiveUpButton,
} from "./components/UI/Buttons";
import HintsList from "./components/Hints/HintsList";
import GuessTable from "./components/Guesses/GuessTable";
import GiveUpModal from "./components/Modals/GiveUpModal";
import usePokeGame from "./hooks/usePokeGame";

const App = () => {
    const {
        targetPokemon,
        guess,
        guesses,
        win,
        filteredPokemon,
        hints,
        hintsLeft,
        showGiveUpModal,
        hasGivenUp,
        handleGuess,
        handleReset,
        handleHint,
        handleInputChange,
        handleSelect,
        handleGiveUp,
        closeModal,
    } = usePokeGame();

    return (
        <div className="min-h-screen bg-white px-3 py-5 sm:px-4 sm:py-8 flex flex-col">
            <div
                className="max-w-3xl mx-auto flex-grow"
                style={{
                    backgroundImage:
                        "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23FF5A5F' strokeWidth='1' fill='none' strokeOpacity='0.1'/%3E%3C/svg%3E')",
                    backgroundSize: "150px 150px",
                }}
            >
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2">
                        <img src="https://www.pikpng.com/pngl/b/494-4945371_pokeball-sprite-png.png" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-1 sm:mb-2">
                        <span className="text-red-500">Poké</span>
                        <span className="text-gray-800">Detective</span>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 text-center max-w-lg px-2">
                        Guess the hidden Pokémon! Compare stats to find the
                        answer.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-4 sm:space-y-5 max-w-md mx-auto px-2 sm:px-0">
                    <GuessInput
                        guess={guess}
                        onChange={handleInputChange}
                        onSelect={handleSelect}
                        filteredPokemon={filteredPokemon}
                        disabled={hasGivenUp || win}
                    />

                    <div className="w-full grid grid-cols-2 gap-2 sm:gap-4">
                        <GuessButton
                            onClick={handleGuess}
                            disabled={hasGivenUp || win}
                        />
                        <HintButton
                            onClick={handleHint}
                            hintsLeft={hintsLeft}
                        />
                    </div>

                    <HintsList hints={hints} />
                </div>

                <GuessTable
                    guesses={[...guesses].reverse()}
                    targetPokemon={targetPokemon}
                />

                {targetPokemon && !win && guesses.length > 0 && (
                    <div className="max-w-md mx-auto mt-5 sm:mt-6 px-2 sm:px-0">
                        <GiveUpButton onClick={handleGiveUp} />
                    </div>
                )}

                {win && (
                    <>
                        <div className="mt-5 sm:mt-6 text-base sm:text-xl font-bold text-center px-3 py-3 bg-green-100 border border-green-300 rounded-xl mx-2 sm:mx-4">
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

                {showGiveUpModal && targetPokemon && (
                    <GiveUpModal
                        targetPokemon={targetPokemon}
                        onClose={closeModal}
                        onNewGame={() => {
                            closeModal();
                            handleReset();
                        }}
                    />
                )}
            </div>

            <footer className="mt-6 py-4 text-center">
                <a
                    href="https://github.com/AdixSasuke/PokeDetective"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="GitHub repository"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="text-sm">GitHub</span>
                </a>
            </footer>
        </div>
    );
};

export default App;
