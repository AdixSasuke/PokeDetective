import React from "react";
import { capitalize } from "../../utils/stringUtils";

const GiveUpModal = ({ targetPokemon, onClose, onNewGame }) => {
    if (!targetPokemon) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4 py-5">
            <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full mx-auto shadow-xl">
                <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">
                        The Pokémon was...
                    </h3>
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
                        <img
                            src={targetPokemon.image}
                            alt={targetPokemon.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-3 sm:mb-4">
                        {targetPokemon.name.toUpperCase()}!
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-5 sm:mb-6 text-xs sm:text-sm">
                        <div className="bg-gray-100 rounded-lg p-2 text-left">
                            <span className="font-medium">Type:</span>{" "}
                            {capitalize(targetPokemon.type1)}
                            {targetPokemon.type2 !== "—"
                                ? `/${capitalize(targetPokemon.type2)}`
                                : ""}
                        </div>
                        <div className="bg-gray-100 rounded-lg p-2 text-left">
                            <span className="font-medium">Generation:</span>{" "}
                            {targetPokemon.generation}
                        </div>
                        <div className="bg-gray-100 rounded-lg p-2 text-left">
                            <span className="font-medium">Color:</span>{" "}
                            {capitalize(targetPokemon.color)}
                        </div>
                        <div className="bg-gray-100 rounded-lg p-2 text-left">
                            <span className="font-medium">Habitat:</span>{" "}
                            {capitalize(targetPokemon.habitat)}
                        </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            Close
                        </button>
                        <button
                            onClick={onNewGame}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                        >
                            New Battle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiveUpModal;
