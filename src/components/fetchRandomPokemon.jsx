// utils/fetchPokemonData.js
import axios from "axios";

const generationMap = {
    "generation-i": 1,
    "generation-ii": 2,
    "generation-iii": 3,
    "generation-iv": 4,
    "generation-v": 5,
    "generation-vi": 6,
    "generation-vii": 7,
    "generation-viii": 8,
    "generation-ix": 9,
};

const fetchPokemonData = async (nameOrId) => {
    try {
        const res = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${nameOrId}`
        );
        const speciesRes = await axios.get(res.data.species.url);
        const species = speciesRes.data;

        return {
            name: res.data.name,
            image: res.data.sprites.front_default,
            generation: generationMap[species.generation.name],
            type1: res.data.types[0]?.type.name || "unknown",
            type2: res.data.types[1]?.type.name || null,
            color: species.color.name,
            habitat: species.habitat?.name || "unknown",
        };
    } catch (err) {
        return null;
    }
};

export default fetchPokemonData;
