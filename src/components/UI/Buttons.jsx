import { memo } from "react";

export const GuessButton = memo(({ onClick, disabled }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-full transition-colors w-full text-sm sm:text-base ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        Catch 'em!
    </button>
));

export const HintButton = memo(({ onClick, hintsLeft }) => (
    <button
        onClick={onClick}
        disabled={hintsLeft <= 0}
        className={`flex items-center justify-center gap-1 sm:gap-2 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-full transition-colors w-full text-sm sm:text-base ${
            hintsLeft > 0
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
            />
        </svg>
        {hintsLeft > 0 ? `${hintsLeft} Hints` : "No Hints"}
    </button>
));

export const ResetButton = memo(({ onClick }) => (
    <button
        onClick={onClick}
        className="mt-4 sm:mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 sm:py-3 px-5 sm:px-6 rounded-full transition-colors mx-auto block text-sm sm:text-base"
    >
        New Battle
    </button>
));

export const GiveUpButton = memo(({ onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center gap-1 sm:gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2.5 sm:py-3 px-5 sm:px-6 rounded-full transition-colors w-full mx-auto text-sm sm:text-base"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
            />
        </svg>
        Give Up
    </button>
));
