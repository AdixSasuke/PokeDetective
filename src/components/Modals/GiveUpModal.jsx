import React from "react";
import { capitalize } from "../../utils/stringUtils";

const GiveUpModal = ({ targetPokemon, onClose, onNewGame }) => {
    if (!targetPokemon) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                        The Pokémon was...
                    </h3>
                    <div className="w-32 h-32 mx-auto mb-4">
                        <img
                            src={targetPokemon.image}
                            alt={targetPokemon.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                        {targetPokemon.name.toUpperCase()}!
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-100 rounded-lg p-2 text-sm">
                            <span className="font-medium">Type:</span>{" "}
                            {capitalize(targetPokemon.type1)}
                            {targetPokemon.type2 !== "—"
                                ? `/${capitalize(targetPokemon.type2)}`
                                : ""}
                        </div>
                        <div className="bg-gray-100 rounded-lg p-2 text-sm">
                            <span className="font-medium">Generation:</span>{" "}
                            {targetPokemon.generation}
                        </div>
                        <div className="bg-gray-100 rounded-lg p-2 text-sm">
                            <span className="font-medium">Color:</span>{" "}
                            {capitalize(targetPokemon.color)}
                        </div>
                        <div className="bg-gray-100 rounded-lg p-2 text-sm">
                            <span className="font-medium">Habitat:</span>{" "}
                            {capitalize(targetPokemon.habitat)}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={onNewGame}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
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
