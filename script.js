let pokedex = [];

async function init() {
    let answer = await fetch('https://pokeapi.co/api/v2/generation/');
    let data = await answer.json();

    let urls = data.results.slice(0, 8).map(generation => generation.url);
    pokedex = await Promise.all(urls.map(url => loadGenerations(url)));

    console.log(pokedex);
}

async function loadGenerations(url) {
    let answer = await fetch(url);
    let data = await answer.json();
    let pokemonUrls = data.pokemon_species.map(p => p.url.replace("pokemon-species", "pokemon"));

    let pokemonData = await Promise.all(pokemonUrls.map(url => loadPokemonByUrl(url)));
    pokemonData.sort((a, b) => a.number - b.number);
    return {
        generation: data.name,
        pokemons: pokemonData
    };
}

async function loadPokemonByUrl(url) {
    try {
        let answer = await fetch(url);
        let data = await answer.json();

        return {
            name: data.name,
            number: data.id,
            img: data.sprites.front_default || "./assets/img/_pokeball.png",
            property: data.types.map(t => t.type.name)
        };
    } catch (error) {
        console.warn("❌ Fehler bei URL:", url, error);
        let numberFromUrl = parseInt(url.match(/\/(\d+)\//)[1]);
        return {
            name: "unknown",
            number: numberFromUrl,
            img: "./assets/img/_pokeball.png",
            property: ["unknown"]
        };
    }
}