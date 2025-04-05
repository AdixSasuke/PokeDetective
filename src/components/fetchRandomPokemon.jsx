// utils/fetchPokemonData.js
import axios from "axios";

const generationMap = {
    "generation-i": "I",
    "generation-ii": "II",
    "generation-iii": "III",
    "generation-iv": "IV",
    "generation-v": "V",
    "generation-vi": "VI",
    "generation-vii": "VII",
    "generation-viii": "VIII",
    "generation-ix": "IX",
};

const fetchPokemonData = async (idOrName) => {
    try {
        const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${idOrName}`
        );
        const speciesResponse = await axios.get(response.data.species.url);
        const species = speciesResponse.data;

        const habitat = speciesResponse.data.habitat
            ? speciesResponse.data.habitat.name
            : "unknown";

        return {
            image: response.data.sprites.front_default,
            name: response.data.name,
            generation:
                generationMap[species.generation.name] ||
                species.generation.name,
            type1: response.data.types[0]?.type.name || null,
            type2: response.data.types[1]?.type.name || null,
            color: species.color.name,
            sprites: response.data.sprites,
            habitat: habitat,
        };
    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        return null;
    }
};

export default fetchPokemonData;
