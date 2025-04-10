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

    const isDark = theme === "dark";

    return (
        <div className="w-full mt-6 sm:mt-8 mx-auto px-4">
            {/* Desktop view - full table */}
            <div
                className={`hidden md:block overflow-hidden rounded-lg ${
                    isDark ? "bg-gray-900" : "bg-white"
                } shadow-lg border ${
                    isDark ? "border-gray-700" : "border-gray-200"
                }`}
            >
                {/* Header */}
                <div className="grid grid-cols-7">
                    {[
                        "Image",
                        "Name",
                        "Generation",
                        "Type 1",
                        "Type 2",
                        "Color",
                        "Habitat",
                    ].map((header, i) => (
                        <div
                            key={i}
                            className={`py-3 text-center font-semibold text-sm ${
                                isDark
                                    ? "bg-gray-800 text-gray-200"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {header}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div>
                    {guesses.map((guess, idx) => (
                        <div
                            key={idx}
                            className={`grid grid-cols-7 divide-x ${
                                isDark ? "divide-gray-700" : "divide-gray-200"
                            }`}
                        >
                            {attributes.map((attr, i) => {
                                if (attr === "image") {
                                    const isCorrect =
                                        targetPokemon &&
                                        guess.name === targetPokemon.name;
                                    const imageBgColor = isCorrect
                                        ? "bg-green-500"
                                        : "bg-red-500";

                                    return (
                                        <div
                                            key={`${idx}-${i}`}
                                            className={`flex items-center justify-center p-3 ${imageBgColor}`}
                                        >
                                            <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center shadow-md">
                                                <img
                                                    src={
                                                        guess.sprites
                                                            .front_default ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={guess.name}
                                                    className="w-14 h-14 object-contain"
                                                />
                                            </div>
                                        </div>
                                    );
                                }

                                const isCorrect =
                                    targetPokemon &&
                                    guess[attr] === targetPokemon[attr];
                                const cellColor = isCorrect
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white";

                                return (
                                    <div
                                        key={`${idx}-${i}`}
                                        className={`flex items-center justify-center p-3 text-center font-medium ${cellColor}`}
                                    >
                                        {attr === "type1" ||
                                        attr === "type2" ||
                                        attr === "color" ||
                                        attr === "habitat"
                                            ? capitalize(guess[attr])
                                            : attr === "name"
                                            ? capitalize(guess[attr])
                                            : guess[attr] || "—"}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile view - stacked cards */}
            <div className="md:hidden space-y-4">
                {guesses.map((guess, idx) => {
                    const isCorrect =
                        targetPokemon && guess.name === targetPokemon.name;
                    const cardBorderColor = isCorrect
                        ? "border-green-500"
                        : "border-red-500";

                    return (
                        <div
                            key={idx}
                            className={`rounded-lg overflow-hidden ${
                                isDark ? "bg-gray-800" : "bg-white"
                            } border-2 ${cardBorderColor} shadow-md`}
                        >
                            {/* Header */}
                            <div
                                className={`flex items-center gap-3 p-4 ${
                                    isCorrect ? "bg-green-500" : "bg-red-500"
                                } text-white`}
                            >
                                <div className="bg-white rounded-lg p-1 shadow-md">
                                    <div className="rounded-lg w-12 h-12 flex items-center justify-center">
                                        <img
                                            src={
                                                guess.sprites.front_default ||
                                                "/placeholder.svg"
                                            }
                                            alt={guess.name}
                                            className="w-10 h-10 object-contain"
                                        />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg capitalize">
                                    {guess.name}
                                </h3>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-2 p-4">
                                {attributes.slice(2).map((attr, i) => {
                                    const isCorrect =
                                        targetPokemon &&
                                        guess[attr] === targetPokemon[attr];
                                    const bgColor = isCorrect
                                        ? "bg-green-500"
                                        : "bg-red-500";
                                    const textColor = "text-white";

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
                                            className={`${bgColor} ${textColor} rounded-lg p-3 flex flex-col`}
                                        >
                                            <span className="text-xs text-white/80">
                                                {label}
                                            </span>
                                            <span className="font-medium">
                                                {attr === "type1" ||
                                                attr === "type2" ||
                                                attr === "color" ||
                                                attr === "habitat"
                                                    ? capitalize(guess[attr])
                                                    : guess[attr] || "—"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div
                className={`text-center ${
                    isDark ? "text-gray-400" : "text-gray-500"
                } py-3 text-sm rounded-lg ${
                    isDark ? "bg-gray-900" : "bg-white"
                } border-t-0 border ${
                    isDark ? "border-gray-700" : "border-gray-200"
                } shadow-lg`}
            >
                {guesses.length} {guesses.length === 1 ? "guess" : "guesses"} so
                far
            </div>
        </div>
    );
};

export default GuessTable;
