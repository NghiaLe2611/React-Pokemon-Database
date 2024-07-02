// Using useReducer

import { useState, useEffect, useMemo, useCallback, useReducer, Fragment } from 'react';
import classes from '../../scss/PokemonTable.module.scss';
import PokemonTableItem from './PokemonTableItem';
import LoadingIndicator from '../UI/LoadingIndicator';
import { pokemonReducer } from '../../store/reducers/pokemonReducer';

const PokemonTableList = (props) => {
    const [state, dispatchState] = useReducer(pokemonReducer, {
        data: JSON.parse(localStorage.getItem('pokemonTableData')) || [],
        isLoading: false,
        error: null,
        nextUrl: localStorage.getItem('nextUrl') || 'https://pokeapi.co/api/v2/pokemon?limit=10',
        sortName: 'id',
        sortType: 'asc'
    });

    const [isSorting, setIsSorting] = useState(false);

    const sortedPokemonList = useMemo(() => {
		let sortableItems = [...state.data];

        const type = state.sortType;
        const key = state.sortName;

        const statArr = ['hp', 'attack', 'defense', 'sp-attack', 'sp-defense', 'speed'];
        const indexStat = statArr.indexOf(key);

		sortableItems.sort((a, b) => {

            if (indexStat >= 0) {
                if (a.stats[indexStat].base_stat < b.stats[indexStat].base_stat) {
                    return type === 'asc' ? -1 : 1;
                }
    
                if (a.stats[indexStat].base_stat > b.stats[indexStat].base_stat) {
                    return type === 'asc' ? 1 : -1;
                }
            } else {
                if (key === 'total') {
                    const totalA = a.stats.reduce((n, { base_stat }) => n + base_stat, 0);
                    const totalB = b.stats.reduce((n, { base_stat }) => n + base_stat, 0);

                    if (totalA < totalB) {
                        return type === 'asc' ? -1 : 1;
                    }
        
                    if (totalA > totalB) {
                        return type === 'asc' ? 1 : -1;
                    }
                } else {
                    if (a[key] < b[key]) {
                        return type === 'asc' ? -1 : 1;
                    }
        
                    if (a[key] > b[key]) {
                        return type === 'asc' ? 1 : -1;
                    }
                }
            }

            return 0;

		});

        if (type === '') {
            sortableItems = [...state.data];
        }

		return sortableItems;
	}, [state.data, state.sortName, state.sortType]);

    const getAllPokemons = async (url) => {

        const fetchData = async () => {
            const response = await fetch(
                url, {
                    method: 'GET',
                }
            );

            dispatchState({ type: 'FETCH_INIT' });

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
                        const types = detail.types.map((item) => item.type.name);

                        const pokemonInfo = {
                            id: detail.id,
                            name: detail.name,
                            stats: detail.stats,
                            types: types,
                            image: detail.sprites.front_default
                        }
                        pokemonList = [...pokemonList, pokemonInfo];
                    }

                    dispatchState({ 
                        type: 'FETCH_SUCCESS',
                        payload: {
                            list: pokemonList, 
                            nextUrl: data.next
                        }
                    });
                }

                createPokemonObject(data.results);

            }
        } catch (err) {
            // console.log(err);
            dispatchState({ 
                type: 'FETCH_FAILURE',
                error: err.message
            });
        }
	};

    useEffect(() => {
        const pokemonDataStorage = JSON.parse(localStorage.getItem('pokemonTableData')) || [];
        if (pokemonDataStorage.length <= 0) {
            console.log('Get all pokemons');
            getAllPokemons('https://pokeapi.co/api/v2/pokemon?limit=10');
        } else {
            console.log('Get pokemonData localStorage')
        }
    }, []);   

    useEffect(() => {
        localStorage.setItem('pokemonTableData', JSON.stringify(state.data));
        localStorage.setItem('nextUrl', state.nextUrl);
    }, [state]);

    const retryFetchData = () => {
        if (state.data.length > 0) {
            getAllPokemons(state.nextUrl);
        } else {
            getAllPokemons('https://pokeapi.co/api/v2/pokemon?limit=10');
        }
    }

    const loadMoreHandler = () => {
        // console.log('LOAD MORE', nextUrl);
        getAllPokemons(state.nextUrl);
    }

    const sortHandler = (filterName) => {
        setIsSorting(true); 
        
        setTimeout(() => {
            dispatchState({ 
                type: 'SORT_DATA',
                name: filterName
            });

            setIsSorting(false); 
        }, 500);
        
    }

    const getClassName = useCallback((filterName) => {
        if (filterName === state.sortName) {
            if (state.sortType === 'asc') {
                return classes.asc;
            }
            else if (state.sortType === 'desc') {
                return classes.desc;
            }
        }

        return;
    }, [state.sortName, state.sortType]);


    let content = state.isLoading && <LoadingIndicator/>;

    if (state.error && state.data.length <= 0) {
        content = (
            <Fragment>
                <p style={{backgroundColor: 'white', padding: '10px 20px'}}>{state.error}</p>
                <button className={classes.button} onClick={retryFetchData}>Retry</button>
            </Fragment>
        );
    }

    if (state.data.length > 0) {
        content = (
            <Fragment>
                <table id='pokedex' className={`${classes['pokemon-table']} ${isSorting ? classes['is-sorting'] : ''}`}>
                    <thead>
                        <tr>
                            <th className={`${classes.sorting} ${getClassName('id')}`}
                                onClick={() => sortHandler('id')}
                            >#</th>
                            <th className={`${classes.sorting} ${getClassName('name')}`}
                                onClick={() => sortHandler('name')}
                            >Name</th>
                            <th>Type</th>
                            <th className={`${classes.sorting} ${getClassName('total')}`}
                                onClick={() => sortHandler('total')}
                            >Total</th>
                            <th className={`${classes.sorting} ${getClassName('hp')}`}
                                onClick={() => sortHandler('hp')}
                            >HP</th>
                            <th className={`${classes.sorting} ${getClassName('attack')}`}
                                onClick={() => sortHandler('attack')}
                            >Attack</th>
                            <th className={`${classes.sorting} ${getClassName('defense')}`}
                                onClick={() => sortHandler('defense')}
                            >Defense</th>
                            <th className={`${classes.sorting} ${getClassName('sp-attack')}`}
                                onClick={() => sortHandler('sp-attack')}
                            >Sp. Atk</th>
                            <th className={`${classes.sorting} ${getClassName('sp-defense')}`}
                                onClick={() => sortHandler('sp-defense')}
                            >Sp. Def</th>
                            <th className={`${classes.sorting} ${getClassName('speed')}`}
                                onClick={() => sortHandler('speed')}
                            >Speed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortedPokemonList.map((item) => (
                                <tr key={item.id}>
                                    <PokemonTableItem
                                        name={item.name}
                                        id={item.id}
                                        types={item.types}
                                        stats={item.stats}
                                        image={item.image}
                                    />
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <button className={classes.button} onClick={loadMoreHandler}>Load more</button>
            </Fragment>
        )
    }
	return (
		<Fragment>
            {content}
            {state.data.length > 0 && state.isLoading && <LoadingIndicator/>} 
		</Fragment>
	);
};

export default PokemonTableList;
