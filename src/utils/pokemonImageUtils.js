/**
 * Utility functions for optimizing Pokémon image loading
 */

// Enhanced cache for storing pokémon data to avoid repeated API calls
export const pokemonCache = {
    // Internal storage
    _storage: {},

    // Helper method to safely get Pokemon data from cache with validation
    get: function (key) {
        if (!key) return null;

        // Convert key to string for consistency
        const safeKey = String(key).toLowerCase();
        const data = this._storage[safeKey];

        // Validate the data has required fields before returning
        if (data && data.name && data.id) {
            return data;
        }
        return null;
    },

    // Helper method to safely set Pokemon data in cache
    set: function (key, data) {
        if (!key || !data) return false;

        // Only cache valid Pokemon data
        if (data && data.name && data.id) {
            // Convert key to string for consistency
            const safeKey = String(key).toLowerCase();
            this._storage[safeKey] = data;
            return true;
        }
        return false;
    },

    // Special case for non-Pokemon data like the list of all names
    setSpecial: function (key, data) {
        if (!key || !data) return false;
        this._storage[key] = data;
        return true;
    },

    // Access non-Pokemon data like the list of all names
    getSpecial: function (key) {
        return this._storage[key];
    },
};

/**
 * Get a Pokémon image URL directly from the ID
 * @param {number|string} id - The Pokémon ID or name
 * @returns {string} - The image URL
 */
export const getPokemonImageUrl = (id) => {
    if (!id) return null; // Return null so PokemonImage component will show the loading animation
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

/**
 * Preload an image by creating an Image object with the URL
 * @param {string} url - The image URL to preload
 */
export const preloadImage = (url) => {
    if (!url) return;

    try {
        const img = new Image();
        img.onerror = () => {
            console.warn(`Failed to preload image: ${url}`);
        };
        img.src = url;
    } catch (error) {
        console.error(`Error preloading image ${url}:`, error);
    }
};

/**
 * Preload the first N Pokémon images
 * @param {number} count - Number of Pokémon images to preload (default: 151)
 */
export const preloadPokemonImages = (count = 151) => {
    // Ensure count is valid
    if (!count || count <= 0 || count > 1010) {
        count = 151; // Default to first gen if invalid
    }

    // Batch image loading to avoid overwhelming the browser
    const batchSize = 20;
    const batches = Math.ceil(count / batchSize);

    for (let batch = 0; batch < batches; batch++) {
        // Delay each batch to reduce browser load
        setTimeout(() => {
            const start = batch * batchSize + 1;
            const end = Math.min((batch + 1) * batchSize, count);

            for (let i = start; i <= end; i++) {
                preloadImage(getPokemonImageUrl(i));
            }
        }, batch * 100); // 100ms delay between batches
    }
};

/**
 * Convert a Pokémon name to its ID for direct image access
 * @param {string} name - The Pokémon name
 * @returns {Promise<number|null>} - The Pokémon ID
 */
export const getPokemonIdFromName = async (name) => {
    // Check cache first
    if (pokemonCache[name] && pokemonCache[name].id) {
        return pokemonCache[name].id;
    }

    // Special cases
    const specialCases = {
        "nidoran-f": 29,
        "nidoran-m": 32,
    };

    if (specialCases[name]) return specialCases[name];

    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        const data = await response.json();

        // Cache the result
        if (!pokemonCache[name]) {
            pokemonCache[name] = {};
        }
        pokemonCache[name].id = data.id;

        return data.id;
    } catch (error) {
        console.error(`Error fetching ID for Pokémon ${name}:`, error);
        return null;
    }
};
