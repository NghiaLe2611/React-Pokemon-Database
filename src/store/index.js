import { combineReducers, configureStore } from '@reduxjs/toolkit';
import pokemonSlice from './pokemon-slice';
import uiSlice from './ui-slice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
	key: 'store',
	storage,
};

const reducers = combineReducers({
    ui: uiSlice.reducer,
    pokemons: pokemonSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    // devTools: process.env.NODE_ENV !== 'production',
    middleware: []
	// reducer: {
	// 	ui: uiSlice.reducer,
	// 	pokemons: pokemonSlice.reducer,
	// },
});

export default store;
