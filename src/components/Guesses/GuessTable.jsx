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

const GuessTable = ({ guesses, targetPokemon, theme }) => {
    if (!guesses || guesses.length === 0) return null;

    // For mobile view, we'll use a different layout
    const isMobile = window.innerWidth < 768;
    const isDark = theme === "dark";

    return (
        <div
            className={`w-full ${isDark ? "bg-gray-800" : "bg-white"} border ${
                isDark ? "border-gray-700" : "border-gray-200"
            } rounded-xl shadow-sm mt-6 sm:mt-8 overflow-hidden mx-auto px-1 sm:px-0`}
        >
            {/* Desktop view - full table */}
            <div
                className={`hidden md:grid grid-cols-7 gap-px ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                }`}
            >
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
                        className="bg-blue-500 text-white px-2 py-3 text-center font-medium text-sm"
                    >
                        {h}
                    </div>
                ))}

                {guesses.map((g, idx) =>
                    attributes.map((attr, i) => {
                        if (attr === "image") {
                            const isCorrect =
                                targetPokemon && g.name === targetPokemon.name;
                            const imageBgColor = isCorrect
                                ? "bg-green-500"
                                : "bg-red-500";

                            return (
                                <div
                                    key={`${idx}-${i}`}
                                    className={`${imageBgColor} flex items-center justify-center p-2`}
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

                        const isCorrect =
                            targetPokemon && g[attr] === targetPokemon[attr];
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

            {/* Mobile view - stacked cards */}
            <div className="md:hidden">
                {guesses.map((g, idx) => {
                    const isCorrect =
                        targetPokemon && g.name === targetPokemon.name;
                    const imageBgColor = isCorrect
                        ? "bg-green-500"
                        : "bg-red-500";

                    return (
                        <div
                            key={idx}
                            className={`border-b ${
                                isDark ? "border-gray-700" : "border-gray-200"
                            } last:border-b-0 p-3`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className={`${imageBgColor} rounded-full p-1`}
                                >
                                    <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center">
                                        <img
                                            src={
                                                g.sprites.front_default ||
                                                "/placeholder.svg"
                                            }
                                            alt={g.name}
                                            className="w-10 h-10 object-contain"
                                        />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg capitalize">
                                    {g.name}
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-1 text-sm">
                                {attributes.slice(2).map((attr, i) => {
                                    const isCorrect =
                                        targetPokemon &&
                                        g[attr] === targetPokemon[attr];
                                    const bgColor = isCorrect
                                        ? isDark
                                            ? "bg-green-900 border-green-700"
                                            : "bg-green-100 border-green-300"
                                        : isDark
                                        ? "bg-red-900 border-red-700"
                                        : "bg-red-100 border-red-300";
                                    const textColor = isCorrect
                                        ? isDark
                                            ? "text-green-400"
                                            : "text-green-700"
                                        : isDark
                                        ? "text-red-400"
                                        : "text-red-700";

                                    if (attr === "image") return null;

                                    const label =
                                        attr === "type1"
                                            ? "Type 1"
                                            : attr === "type2"
                                            ? "Type 2"
                                            : capitalize(attr);

                                    return (
                                        <div
                                            key={`mobile-${idx}-${i}`}
                                            className={`${bgColor} ${textColor} border rounded-md p-2 flex flex-col`}
                                        >
                                            <span
                                                className={`text-xs ${
                                                    isDark
                                                        ? "text-gray-400"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {label}
                                            </span>
                                            <span className="font-medium">
                                                {attr === "type1" ||
                                                attr === "type2" ||
                                                attr === "color" ||
                                                attr === "habitat"
                                                    ? capitalize(g[attr])
                                                    : g[attr] || "—"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div
                className={`text-center ${
                    isDark ? "text-gray-400" : "text-gray-500"
                } py-2 sm:py-3 text-xs sm:text-sm`}
            >
                {guesses.length} {guesses.length === 1 ? "guess" : "guesses"} so
                far
            </div>
        </div>
    );
};

export default GuessTable;
