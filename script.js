let pokedex = [];
let currentGenerationIndex = 0;


function showLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'flex';
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'none';
}

dropDownEventListeners();

async function init() {
    showLoadingScreen();

    window.scrollTo(0, 0);

    let answer = await fetch('https://pokeapi.co/api/v2/generation/');
    let data = await answer.json();

    let urls = data.results.slice(0, 8).map(generation => generation.url);
    pokedex = await Promise.all(urls.map(url => loadGenerations(url)));

    console.log(pokedex);

    showGeneration(currentGenerationIndex);
    dropDownUpdate();

    hideLoadingScreen();
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
        console.warn("Fehler bei URL:", url, error);
        let numberFromUrl = parseInt(url.match(/\/(\d+)\//)[1]);
        return {
            name: "unknown",
            number: numberFromUrl,
            img: "./assets/img/_pokeball.png",
            property: ["unknown"]
        };
    }
}

function showGeneration(index) {
    let oneGeneration = document.getElementById('mainSectionMain');
    oneGeneration.innerHTML = "";

    let pokemons = pokedex[index].pokemons

    for (let i = 0; i < pokemons.length; i++) {
        oneGeneration.innerHTML += /*html*/`
        <div onclick="" class="card" id="card">
            <section class="card_header">
                <span>#${pokemons[i].number}</span>
                <span>${pokemons[i].name}</span>
            </section>

            <section class="card_main ${pokemons[i].property[0]}_type">
                <img class="card_main_pokemon_img" src="${pokemons[i].img}">
            </section>

            <section class="card_footer">
                <img class="${pokemons[i].property[0]}_type" src="./assets/img/${pokemons[i].property[0]}Type.png">
                ${pokemons[i].property[1] ? `<img class="${pokemons[i].property[1]}_type" src="./assets/img/${pokemons[i].property[1]}Type.png">` : ""}                    
            </section>
        </div>`
    };
}

function nextGeneration() {
    if (currentGenerationIndex < 7) {
        currentGenerationIndex++;
        document.getElementById('buttonPrevious').style.display = 'flex';
        updateButtonVisibility()
        init();
    }
}

function previousGeneration() {
    if (currentGenerationIndex > 0) {
        currentGenerationIndex--;
        document.getElementById('buttonNext').style.display = 'flex';
        updateButtonVisibility()
        init();
    }
}

function dropDownUpdate() {
    document.getElementById('genSelect').value = currentGenerationIndex + 1;
}

function dropDownEventListeners() {
    document.getElementById('genSelect').addEventListener('change', () => {
        currentGenerationIndex = parseInt(document.getElementById('genSelect').value) - 1;
        updateButtonVisibility()
        init();
    });
}

function updateButtonVisibility() {
    document.getElementById('buttonNext').style.display = currentGenerationIndex >= 7 ? 'none' : 'flex';
    document.getElementById('buttonPrevious').style.display = currentGenerationIndex <= 0 ? 'none' : 'flex';
}