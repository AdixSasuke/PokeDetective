import React from "react";
import { capitalize } from "../../utils/stringUtils";

const attributes = [
    "image",
    "name",
    "generation",
    "type1",
    "type2",
    "color",
    "habitat",
];

const GuessTable = ({ guesses, targetPokemon }) => {
    if (!guesses || guesses.length === 0) return null;

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm mt-8 overflow-hidden">
            <div className="grid grid-cols-7 gap-px bg-gray-100">
                {[
                    "Image",
                    "Name",
                    "Gen",
                    "Type 1",
                    "Type 2",
                    "Color",
                    "Habitat",
                ].map((h, i) => (
                    <div
                        key={i}
                        className="bg-blue-500 text-white px-3 py-3 text-center font-medium"
                    >
                        {h}
                    </div>
                ))}

                {guesses.map((g, idx) =>
                    attributes.map((attr, i) => {
                        if (attr === "image") {
                            return (
                                <div
                                    key={`${idx}-${i}`}
                                    className="bg-red-500 flex items-center justify-center p-2"
                                >
                                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                                        <img
                                            src={
                                                g.sprites.front_default ||
                                                "/placeholder.svg"
                                            }
                                            alt={g.name}
                                            className="w-14 h-14 object-contain"
                                        />
                                    </div>
                                </div>
                            );
                        }

                        // Check if the guessed value matches the target value
                        const isCorrect =
                            targetPokemon && g[attr] === targetPokemon[attr];

                        // Use green background for correct guesses, red for incorrect
                        const cellColor = isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white";

                        return (
                            <div
                                key={`${idx}-${i}`}
                                className={`${cellColor} flex items-center justify-center p-3 text-center font-medium`}
                            >
                                {attr === "type1" ||
                                attr === "type2" ||
                                attr === "color" ||
                                attr === "habitat"
                                    ? capitalize(g[attr])
                                    : attr === "name"
                                    ? capitalize(g[attr])
                                    : g[attr] || "—"}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="text-center text-gray-500 py-3 text-sm">
                {guesses.length} {guesses.length === 1 ? "guess" : "guesses"} so
                far
            </div>
        </div>
    );
};

export default GuessTable;
