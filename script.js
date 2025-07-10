let pokedex = [];
let currentGenerationIndex = 0;


async function controllLoadingScreen(action) {
    document.getElementById('loadingScreen').style.display = 'flex';

    window.scrollTo(0, 0);

    let minDelay = new Promise(resolve => setTimeout(resolve, 1600));
    let task = action();

    await Promise.all([minDelay, task]);

    document.getElementById('loadingScreen').style.display = 'none';
}

dropDownEventListeners();

async function init() {
    await controllLoadingScreen(async () => {

        let answer = await fetch('https://pokeapi.co/api/v2/generation/');
        let data = await answer.json();

        let urls = data.results.slice(0, 9).map(generation => generation.url);
        pokedex = await Promise.all(urls.map(url => loadGenerations(url)));

        showGeneration(currentGenerationIndex);
        dropDownUpdate();
        setupSearch();
    });
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
            hoverImg: data.sprites.other?.showdown?.front_default || "./assets/img/_pokeball.png",
            cry: data.cries.legacy,
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

async function showGeneration(index) {
    await controllLoadingScreen(async () => {

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
                <img class="card_main_pokemon_img default_img" src="${pokemons[i].img}">
                <img class="card_main_pokemon_hover_img hover_img" src="${pokemons[i].hoverImg}">
            </section>

            <section class="card_footer">
                <img class="${pokemons[i].property[0]}_type" src="./assets/img/${pokemons[i].property[0]}Type.png">
                ${pokemons[i].property[1] ? `<img class="${pokemons[i].property[1]}_type" src="./assets/img/${pokemons[i].property[1]}Type.png">` : ""}                    
            </section>
        </div>`
        }
    });
}

function nextGeneration() {
    if (currentGenerationIndex < 8) {
        currentGenerationIndex++;
        document.getElementById('buttonPrevious').style.display = 'flex';
        updateButtonVisibility();
        dropDownUpdate();
        showGeneration(currentGenerationIndex);
    }
}

function previousGeneration() {
    if (currentGenerationIndex > 0) {
        currentGenerationIndex--;
        document.getElementById('buttonNext').style.display = 'flex';
        updateButtonVisibility();
        dropDownUpdate();
        showGeneration(currentGenerationIndex);
    }
}

function dropDownUpdate() {
    document.getElementById('genSelect').value = currentGenerationIndex + 1;
}

function dropDownEventListeners() {
    document.getElementById('genSelect').addEventListener('change', () => {
        currentGenerationIndex = parseInt(document.getElementById('genSelect').value) - 1;
        updateButtonVisibility()
        showGeneration(currentGenerationIndex);
        document.getElementById('searchPokemons').value = '';
    });
}

function updateButtonVisibility() {
    document.getElementById('buttonNext').style.display = currentGenerationIndex >= 8 ? 'none' : 'flex';
    document.getElementById('buttonPrevious').style.display = currentGenerationIndex <= 0 ? 'none' : 'flex';
}

function hideButtons() {
    document.getElementById('buttonNext').style.display = 'none';
    document.getElementById('buttonPrevious').style.display = 'none';
}

function setupSearch() {
    let input = document.getElementById('searchPokemons');
    input.addEventListener('input', () => {
        let searchTerm = input.value.trim().toLowerCase();
        filterName(searchTerm);
    });
}

function filterName(searchTerm) {
    if (searchTerm.length === 0) {
        document.getElementById('searchMessage').style.visibility = 'hidden'
        updateButtonVisibility();
        showGeneration(currentGenerationIndex);
    } else if (searchTerm.length < 3) {
        document.getElementById('searchMessage').style.visibility = 'visible'
        document.getElementById('mainSectionMain').innerHTML = '';
        hideButtons();
    } else {
        document.getElementById('searchMessage').style.visibility = 'hidden'

        hideButtons();

        let allPokemons = pokedex.flatMap(generation => generation.pokemons);

        let filtered = allPokemons.filter(p => p.name.toLowerCase().includes(searchTerm));

        showFilteredPokemons(filtered);
    }
}

function showFilteredPokemons(pokemons) {
    let container = document.getElementById('mainSectionMain');
    container.innerHTML = '';

    for (let i = 0; i < pokemons.length; i++) {
        container.innerHTML += /*html*/`
        <div class="card">
            <section class="card_header">
                <span>#${pokemons[i].number}</span>
                <span>${pokemons[i].name}</span>
            </section>

            <section class="card_main ${pokemons[i].property[0]}_type">
                <img class="card_main_pokemon_img default_img" src="${pokemons[i].img}">
                <img class="card_main_pokemon_img hover_img" src="${pokemons[i].hoverImg}">
            </section>

            <section class="card_footer">
                <img class="${pokemons[i].property[0]}_type" src="./assets/img/${pokemons[i].property[0]}Type.png">
                ${pokemons[i].property[1] ? `<img class="${pokemons[i].property[1]}_type" src="./assets/img/${pokemons[i].property[1]}Type.png">` : ""}
            </section>
        </div>`;
    }
}