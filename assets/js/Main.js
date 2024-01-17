let listaHtml = document.querySelector("#pokemonsList");
let inputPokemonName = document.querySelector('#inputPokemonName');
let buttonSearch = document.querySelector('#buttonSearch');

let buttonLoadMore = document.querySelector("#buttonLoadMore");

let pokemonsSize = 0;

function converterPokemonsListToLi(pokemonsList){
    let pokemonsListHtml = "";
    
    pokemonsList.forEach(pokemon => {
        pokemonsListHtml += `<li id="pokemon-${pokemon.idNumber}" class="lipokemon">
        <span id="name" class="pokemon-name-span" >${pokemon.name}</span>
            <div class="details">
                <img src="${pokemon.photo}">
            </div>
        </li> `; 
    });

    listaHtml.innerHTML += pokemonsListHtml;

    pokemonsList.forEach(pokemon => {
        let li = document.querySelector(`#pokemon-${pokemon.idNumber}`);

        li.addEventListener('click', (e) => {
            window.location.assign(`/pages/viewPokemon.html?nameOrId=${pokemon.idNumber}`);
        })
    });
}

function converterPokemonsJsonToModel(pokemonsJsonList){
    let pokemonsList = [];

    for (let index = 0; index < pokemonsJsonList.length; index++) {
        const element = pokemonsJsonList[index];
        const pokemon = new Pokemon();
        pokemon.idNumber = element.id;
        pokemon.name = element.name;
        pokemon.photo = element.sprites.other.dream_world.front_default;
        
        pokemonsList.push(pokemon);
    }

    return pokemonsList;
}

function getPokemonsList(offset){
    const limit = 12;

    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    fetch(url)
        .then((response) => response.json())
        .then((bodyResponse) => bodyResponse.results)
        .then((pokemonsLinkList) => pokemonsLinkList.map(e => fetch(e.url).then((e) => e.json())))
        .then((bodyResponse) => Promise.all(bodyResponse))
        .then((pokemonsJsonList) => converterPokemonsJsonToModel(pokemonsJsonList))
        .then((pokemonsList) => converterPokemonsListToLi(pokemonsList))
        .catch((error) => console.error(error));
        
    pokemonsSize += limit;    
}

function getPokemonByNameOrId(nameOrId){
    window.location.assign(`/pages/viewPokemon.html?nameOrId=${nameOrId}`);
}

function loadMorePokemons(){
    getPokemonsList(pokemonsSize); 
}

buttonSearch.addEventListener('click', (e) => {
    let nameOrId = inputPokemonName.value;
    let isNotNull = nameOrId !== null 
        && nameOrId !== undefined;

    if (isNotNull){
        if(isNaN(nameOrId)){
            getPokemonByNameOrId(nameOrId.toLowerCase());
        } else {
            getPokemonByNameOrId(nameOrId);
        }
    } else {
        alert("Please enter your pokemon's name or number!");
    }
});

buttonLoadMore.addEventListener('click', (e) =>{
    loadMorePokemons();
});

function main(){
    getPokemonsList(0);    
}

main();