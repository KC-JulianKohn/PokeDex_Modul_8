async function openPokemonPopup(pokemonNumber) {
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

  document.body.style.overflow = 'hidden';
}
