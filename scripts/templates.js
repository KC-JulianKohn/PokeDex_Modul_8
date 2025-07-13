function renderCard(pokemon) {
    return /*html*/`
        <div onclick="openPokemonPopup(${pokemon.number})" class="card" id="card">
            <section class="card_header">
                <span>#${pokemon.number}</span>
                <span>${pokemon.name}</span>
            </section>

            <section class="card_main ${pokemon.property[0]}_type">
                <img class="card_main_pokemon_img default_img" src="${pokemon.img}">
                <img class="card_main_pokemon_hover_img hover_img" src="${pokemon.hoverImg}">
            </section>

            <section class="card_footer">
                <img class="${pokemon.property[0]}_type" src="./assets/img/${pokemon.property[0]}Type.png">
                ${pokemon.property[1] ? `<img class="${pokemon.property[1]}_type" src="./assets/img/${pokemon.property[1]}Type.png">` : ""}                    
            </section>
        </div>`
}

function returnPokemonData(data) {
    return {
        name: data.name,
        number: data.id,
        img: data.sprites.front_default || "./assets/img/_pokeball.png",
        hoverImg: data.sprites.other?.showdown?.front_default || data.sprites.front_default,
        property: data.types.map(t => t.type.name)
    };
}

function returnPokemonDataError(number) {
    return {
        name: "unknown",
        number: number,
        img: "./assets/img/_pokeball.png",
        property: ["unknown"]
    };
}

function renderPopupHtml(data) {
    return /*html*/`
        <div class="popup_fenster">
            <div>
                <button onclick="closePokemonPopup()" id="popupCloseBtn" class="popup_close_btn">✖</button>
            </div>

            <div class="popup_main_part">
                <div>
                    <button onclick="showPreviousPokemon()" id="btnPrev" class="popup_nav_btn">&lt;</button>
                </div>

                <div class="popup_body">
                    <section class="popup_header">
                        <div class="popup_header_text">
                            <span>#${data.id}</span>
                            <span>${data.name}</span>
                        </div>
                        <div class="popup_header_types">
                            <img class="${data.types[0].type.name}_type" src="./assets/img/${data.types[0].type.name}Type.png">
                            ${data.types[1] ? `<img class="${data.types[1].type.name}_type" src="./assets/img/${data.types[1].type.name}Type.png">` : ""}
                        </div>
                    </section>

                    <section class="popup_image_section ${data.types[0].type.name}_type">
                        <div class="popup_image_controls">
                            <button onclick="playPokemonCry()" id="btnPlayCry" class="popup_img_btn">🔊 Audio</button>
                            <button onclick="toggleShinyImage()" id="btnToggleShiny" class="popup_img_btn"><img class="shinny_star" src="./assets/img/_star.png">Shinny</button>
                        </div>
                        <div class="popup_image_display">
                            <img id="pokemonMainImage" src="${data.sprites.other.home.front_default}">
                            <img id="pokemonMainImageShiny" src="${data.sprites.other.home.front_shiny}" style="display: none;">
                        </div>
                    </section>

                    <section class="popup_tabs">
                        <div onclick="showTabContent('description')" id="tabDescription" class="popup_tab activ">
                            <span>Description</span>
                        </div>
                        <div onclick="showTabContent('stats')" id="tabStats" class="popup_tab">
                            <span>Stats</span>
                        </div>
                    </section>

                    <section class="popup_tab_content">
                        <div id="tabContentDescription" class="tab_content_block">
                            <p>${data.description}</p>
                        </div>
                        <div id="tabContentStats" class="tab_content_block" style="display: none;">
                            ${renderStats(data.stats)}
                        </div>
                    </section>
                </div>

                <div>
                    <button onclick="showNextPokemon()" id="btnNext" class="popup_nav_btn">&gt;</button>
                </div>
            </div>
        </div>`
}

function renderStats(stats) {
  return `
    <table class="stats-table">
      ${stats.map(stat => `
        <tr>
          <td class="stat-label">${stat.stat.name}</td>
          <td class="stat-separator">&nbsp; : &nbsp;</td>
          <td class="stat-value">${stat.base_stat}</td>
        </tr>
      `).join('')}
    </table>
  `;
}
