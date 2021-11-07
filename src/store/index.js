import { configureStore } from '@reduxjs/toolkit';
import pokemonSlice from './pokemon-slice';
import uiSlice from './ui-slice';

const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        pokemons: pokemonSlice.reducer
    } 
});

export default store;