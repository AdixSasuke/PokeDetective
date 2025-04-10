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
        <div className="min-h-screen bg-white px-3 py-5 sm:px-4 sm:py-8">
            <div
                className="max-w-3xl mx-auto"
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

                <GuessTable guesses={guesses} targetPokemon={targetPokemon} />

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
        </div>
    );
};

export default App;
