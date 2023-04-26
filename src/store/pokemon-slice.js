import { createSlice } from '@reduxjs/toolkit';

// function sortAscending(arr, field) {
// 	return arr.sort(function (a, b) {
// 		if (a[field] > b[field]) {
// 			return 1;
// 		}
// 		if (b[field] > a[field]) {
// 			return -1;
// 		}
// 		return 0;
// 	});
// }

// function sortDescending(arr, field) {
// 	return arr.sort(function (a, b) {
// 		if (a[field] > b[field]) {
// 			return -1;
// 		}
// 		if (b[field] > a[field]) {
// 			return 1;
// 		}
// 		return 0;
// 	});
// }

const pokemonSlice = createSlice({
	name: 'pokemons',
	initialState: {
		pokemonList: [],
		nextUrl: 'https://pokeapi.co/api/v2/pokemon?limit=20'
	},
	reducers: {
		setPokemonData(state, action) {
			state.pokemonList = state.pokemonList.concat(action.payload.pokemonList);
			state.nextUrl = action.payload.nextUrl;
		}
	},
});

export const pokemonActions = pokemonSlice.actions;

export default pokemonSlice;
