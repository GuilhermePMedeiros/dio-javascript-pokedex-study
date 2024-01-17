const imagePokemon = document.querySelector("#imagePokemon");
const namePokemon = document.querySelector("#namePokemon");

const typesListPokemon = document.querySelector("#typesListPokemon");
const abilitiesListPokemon = document.querySelector("#abilitiesListPokemon");
const locationsListPokemon = document.querySelector("#locationsListPokemon");
const detailsContainer = document.querySelector("#detailsContainer");

function getParameter(){
    const params = new URLSearchParams(window.location.search);
    const nameOrId = params.get('nameOrId');
    
    return nameOrId;
}

function converterPokemonJsonToModel(pokemonJson){
    let pokemon = new Pokemon();
    if (isFill(pokemonJson.id)){
        pokemon.idNumber = pokemonJson.id;
        pokemon.name = pokemonJson.name;
        pokemon.photo = pokemonJson.sprites.other.dream_world.front_default;
        pokemon.types = pokemonJson.types;
        pokemon.abilities = pokemonJson.abilities;
    } else{
        pokemon = null;
    }

    return pokemon;
}

function getPokemonByNameOrId(nameOrId){
    const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;
    
    fetch(url)
        .then((response) => 
        { 
            if(response.status > 399){
                fillNotFound();
            } else {
                return response.json()
            }
        })
        .then((pokemonJson) => converterPokemonJsonToModel(pokemonJson))
        .then((pokemon) => {
            fillDetailsPokemon(pokemon);
        })
        .catch((error) => console.error(error));
}

function fillNotFound() {
    detailsContainer.innerHTML = `
    <div class="not-found-pokemon">
        Pokemon not found
    </div>
    `;
}

function isFill(obj) {
    return (!!Object.values(obj).length || !!Object.keys(obj).length) || obj !== null ;    
}

function convertertypesToLi(pokemon){
    let typesHtmlli = "";

    pokemon.types.forEach(type => {
        typesHtmlli += `<li class="type-pokemon"> ${type.type.name} </li>`
    });

    return typesHtmlli;
}

function converterAbilitiesToLi(pokemon){
    let abilitiesHtmlli = "";

    pokemon.abilities.forEach(ability => {
        abilitiesHtmlli += `<li class="ability-pokemon"> ${ability.ability.name} </li>`
    });

    return abilitiesHtmlli;
}

function converterLocationToLi(locationNamesList){
    let locationsHtmlli = "";

    let isFill = Object.keys(locationNamesList).length !== 0;

    if (isFill){
        locationNamesList.forEach(location => {
            locationsHtmlli += `<li class="location-pokemon-li"> ${location} </li>`
        });
    } else{
        locationsHtmlli += `<li class="location-pokemon-li">Pokemon without registered location</li>`;
    }

    return locationsHtmlli;
}

function getLocationPokemon(idPokemom){
    const url = `https://pokeapi.co/api/v2/pokemon/${idPokemom}/encounters`;

    fetch(url)
        .then((response) => response.json())
        .then((locationList) => locationList.map(x => x.location_area.name))
        .then((locationNamesList) => converterLocationToLi(locationNamesList))
        .then((locationsListLi) => {
            locationsListPokemon.innerHTML = locationsListLi;
        })
        .catch((error) => console.error(error));
}

function fillDetailsPokemon(pokemon){
    if(isFill(pokemon.photo)){
        imagePokemon.src= pokemon.photo;
    };
    
    namePokemon.innerHTML = pokemon.name; 
    typesListPokemon.innerHTML = convertertypesToLi(pokemon);
    abilitiesListPokemon.innerHTML = converterAbilitiesToLi(pokemon);

    getLocationPokemon(pokemon.idNumber);
}

function main(){
    getPokemonByNameOrId(getParameter());
}

main();