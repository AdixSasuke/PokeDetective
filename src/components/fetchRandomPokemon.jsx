import axios from "axios";

const fetchPokemonData = async (idOrName) => {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${idOrName}`;
        const pokemon = await axios.get(url);

        const speciesUrl = pokemon.data.species.url;
        const speciesData = await axios.get(speciesUrl);

        const flavorTextEntry = speciesData.data.flavor_text_entries.find(
            (entry) => entry.language.name === "en"
        );
        const description = flavorTextEntry
            ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, " ")
            : "No description available.";

        const generationUrl = speciesData.data.generation.url;
        const generationData = await axios.get(generationUrl);
        const generation = generationData.data.name.replace("generation-", "");

        const colorUrl = speciesData.data.color.url;
        const colorData = await axios.get(colorUrl);
        const color = colorData.data.name;

        const habitatUrl = speciesData.data.habitat?.url;
        const habitatData = habitatUrl ? await axios.get(habitatUrl) : null;
        const habitat = habitatData ? habitatData.data.name : "unknown";

        const type1 = pokemon.data.types[0].type.name;
        const type2 = pokemon.data.types[1]?.type.name || "—";

        return {
            name: pokemon.data.name,
            image: pokemon.data.sprites.front_default,
            description: description,
            generation: generation.toUpperCase(),
            type1: type1,
            type2: type2,
            color: color,
            habitat: habitat,
            sprites: pokemon.data.sprites,
        };
    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        return null;
    }
};

export default fetchPokemonData;
