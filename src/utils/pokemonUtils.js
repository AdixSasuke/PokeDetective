/**
 * Get the Pokémon ID from the name
 * @param {string} name - The Pokémon name
 * @returns {Promise<number|null>} - The Pokémon ID or null if not found
 */
export const getPokemonId = (name) => {
    const specialCases = {
        "nidoran-f": 29,
        "nidoran-m": 32,
    };

    if (specialCases[name]) return Promise.resolve(specialCases[name]);

    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    return fetch(url)
        .then((res) => res.json())
        .then((data) => data.id)
        .catch(() => null);
};

/**
 * List of attributes to compare between Pokémon
 */
export const attributes = [
    "image",
    "name",
    "generation",
    "type1",
    "type2",
    "color",
    "habitat",
];
