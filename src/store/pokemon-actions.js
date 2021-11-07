import { pokemonActions } from './pokemon-slice';
import { uiActions } from './ui-slice';

export const fetchPokemonData = (apiUrl) => {
    // const pokemonDataStorage = JSON.parse(localStorage.getItem('pokemonTableData'));

    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch(
                apiUrl, {
                    method: 'GET',
                }
            );

            dispatch(
                uiActions.showStatus({
                    isLoading: true,
                    error: null
                })
            );

            if (!response.ok) {
                throw new Error('Could not fetch data!');
            }

            const data = await response.json();

            return data;
        };

        try {
            const data = await fetchData();
            let pokemonList = [];

            if (data) {
                async function createPokemonObject(results) {
                    for (const pokemon of results) {
                        const res = await fetch(
                            `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
                        );
                        const detail = await res.json();
                        const pokemonInfo = {
                            id: detail.id,
                            name: detail.name,
                            stats: detail.stats,
                            types: detail.types,
                            image: detail.sprites.front_default
                        }
                        pokemonList = [...pokemonList, pokemonInfo];
                    }

                    dispatch(pokemonActions.setPokemonData({
                        pokemonList: pokemonList,
                        nextUrl: data.next
                    }));

                    localStorage.setItem('nextUrl', data.next);
                }

                createPokemonObject(data.results);

                setTimeout(() => {
                    dispatch(
                        uiActions.showStatus({
                            isLoading: false,
                            error: null
                        })
                    );
                }, 300);
            }
        } catch (err) {
            console.log(err);
            setTimeout(() => {
                dispatch(
                    uiActions.showStatus({
                        isLoading: false,
                        error: null
                    })
                );
            }, 300);
        }
    };
	
};
