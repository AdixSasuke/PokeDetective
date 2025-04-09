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
                        disabled={hasGivenUp || win}
                    />

                    <div className="w-full grid grid-cols-2 gap-4">
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
                    <div className="max-w-md mx-auto mt-6">
                        <GiveUpButton onClick={handleGiveUp} />
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
