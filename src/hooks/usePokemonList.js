import axios from "axios";
import { useEffect, useState } from "react";

function usePokemonList(){
    const [pokemonListState, setPokemonListState]= useState({
        pokemonList:[],
        isLoading:true,
        pokedexUrl:'https://pokeapi.co/api/v2/pokemon',
        nextUrl:'',
        prevUrl:'',
    });

    async function downloadPokemons(){
        

            setPokemonListState((state)=>({...state,isLoading:true}));
        const response= await axios.get(pokemonListState.pokedexUrl);  //this download list of 20 pokemons

        const pokemonsResults = response.data.results;  //we get the array of pokemons from result
        
        console.log("response ise",response.data.pokemon);
        console.log(pokemonListState);
        setPokemonListState((state)=>({
            ...state,
            nextUrl:response.data.next,
            prevUrl:response.data.previous
        }));


        const pokemonResultPromise=pokemonsResults.map((pokemon)=> axios.get(pokemon.url));

        //passing that promise array to axios.all
        const pokemonData =await axios.all(pokemonResultPromise); //array of 20 pokemon detailed data
        console.log(pokemonData);

        // now iterate the each data and extract the id, name , image, types
        const pokeListResult = pokemonData.map((pokeData)=>{
            const pokemon = pokeData.data;
            return{
                   id:pokemon.id,
                   name: pokemon.name,
                   image:(pokemon.sprites.other)? pokemon.sprites.other.dream_world.front_default: pokemon.sprites.front_shiny,
                   types:pokemon.types
                }
        });
        
        setPokemonListState((state)=>({
            ...state, 
            pokemonList:pokeListResult,
            isLoading:false
        }));
     
    }

    useEffect(()=>{
        downloadPokemons();
    },[pokemonListState.pokedexUrl]);

    
        return [pokemonListState, setPokemonListState];
    }


export default usePokemonList;