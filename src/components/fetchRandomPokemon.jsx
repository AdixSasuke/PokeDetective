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

const fetchPokemonData = async (nameOrId) => {
    try {
        const res = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${nameOrId}`
        );
        const speciesRes = await axios.get(res.data.species.url);
        const species = speciesRes.data;

        return {
            image: res.data.sprites.front_default,
            name: res.data.name,
            generation:
                generationMap[species.generation.name] ||
                species.generation.name,
            type1: res.data.types[0]?.type.name || null,
            type2: res.data.types[1]?.type.name || null,
            color: species.color.name,
            sprites: res.data.sprites,
        };
    } catch (err) {
        return null;
    }
};

export default fetchPokemonData;
