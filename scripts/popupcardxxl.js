async function openPokemonPopup(pokemonNumber) {
  currentPokemonList = pokedex[currentGenerationIndex].pokemons;
  currentPokemonIndex = currentPokemonList.findIndex(p => p.number === pokemonNumber);

  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;
  let response = await fetch(url);
  let data = await response.json();

  let speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonNumber}`;
  let speciesResponse = await fetch(speciesUrl);
  let speciesData = await speciesResponse.json();

  let descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
  data.description = descriptionEntry ? descriptionEntry.flavor_text.replace(/\f/g, ' ') : "No description available.";

  let popupTarget = document.getElementById('popupTarget');
  popupTarget.innerHTML = renderPopupHtml(data);

  updatePopupNavButtons()

  document.body.style.overflow = 'hidden';
}

function closePokemonPopup() {
  document.getElementById('popupTarget').innerHTML = '';
  document.body.style.overflow = 'auto';

  currentPokemonIndex = null;
  currentPokemonList = [];
}

function showPreviousPokemon() {
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    openPokemonPopup(currentPokemonList[currentPokemonIndex].number);
  }
}

function showNextPokemon() {
  if (currentPokemonIndex < currentPokemonList.length - 1) {
    currentPokemonIndex++;
    openPokemonPopup(currentPokemonList[currentPokemonIndex].number);
  }
}

function updatePopupNavButtons() {
  let btnPrev = document.getElementById('btnPrev');
  let btnNext = document.getElementById('btnNext');

  if (!btnPrev || !btnNext || !currentPokemonList.length) return;

  btnPrev.style.display = currentPokemonIndex > 0 ? 'flex' : 'none';
  btnNext.style.display = currentPokemonIndex < currentPokemonList.length - 1 ? 'flex' : 'none';
}

function playPokemonCry() {
  let currentPokemon = currentPokemonList[currentPokemonIndex];
  let cryUrl = `https://play.pokemonshowdown.com/audio/cries/${currentPokemon.name.toLowerCase()}.ogg`;

  let audio = new Audio(cryUrl);
  audio.play().catch(err => {
    console.warn("Fehler beim Abspielen des Sounds:", err);
  });
}

function toggleShinyImage() {
  let normalImg = document.getElementById('pokemonMainImage');
  let shinyImg = document.getElementById('pokemonMainImageShiny');
  let toggleBtn = document.getElementById('btnToggleShiny');

  if (!normalImg || !shinyImg || !toggleBtn) return;

  let isShinyVisible = shinyImg.style.display !== 'none';

  shinyImg.style.display = isShinyVisible ? 'none' : 'block';
  normalImg.style.display = isShinyVisible ? 'block' : 'none';

  toggleBtn.innerHTML = isShinyVisible ? '<img class="shinny_star" src="./assets/img/_star.png">Shinny' : '🔁 Normal';
}