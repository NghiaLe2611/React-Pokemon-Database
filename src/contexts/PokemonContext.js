import { initialState, pokemonReducer } from '@/store/reducers/pokemonReducer';
import { createContext, useReducer, useContext } from 'react';

const PokemonContext = createContext(null);

export const PokemonProvider = ({ children }) => {
    const [state, dispatchState] = useReducer(pokemonReducer, initialState);

    return (
        <PokemonContext.Provider value={{ state, dispatchState }}>
            {children}
        </PokemonContext.Provider>
    );
};

export const usePokemon = () => useContext(PokemonContext);
