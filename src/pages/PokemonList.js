import { useState, useEffect, useMemo, useCallback, useReducer, Fragment } from 'react';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import PokemonItem from '../components/List/PokemonItem';
import PokemonTableItem from '../components/Table/PokemonTableItem';
import { pokemonReducer } from '../store/reducers/pokemonReducer';
import classes from '../scss/PokemonMain.module.scss';
import { capitalizeFirstLetter } from '../helpers/helpers';

const typeArr = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy'
];

const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=30';

const PokemonMainPage = () => {
    const [state, dispatchState] = useReducer(pokemonReducer, {
        data: JSON.parse(localStorage.getItem('pokemonTableData')) || [],
        isLoading: false,
        error: null,
        nextUrl: localStorage.getItem('nextUrl') || apiUrl,
        sortName: 'id',
        sortType: 'asc'
    });
    const [filterType, setFilterType] = useState("");
    const [isFiltering, setIsFiltering] = useState(false);
    const [searchKey, setSearchKey] = useState('');

    let sortedPokemonList = useMemo(() => {
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

        if (filterType.length) {
            sortableItems = sortableItems.filter(item => item.types.includes(filterType) === true);
        } else {
            sortableItems = sortableItems.filter(item => item.name);
        }

        if (searchKey.length) {
            sortableItems = sortableItems.filter(item => item.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1);
        }

		return sortableItems;
	}, [state.data, state.sortName, state.sortType, filterType, searchKey]);

    const [view, setView] = useState('LIST');
    
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
            getAllPokemons(apiUrl);
        }
    }, []);   

    useEffect(() => {
        localStorage.setItem('pokemonTableData', JSON.stringify(state.data));
        localStorage.setItem('nextUrl', state.nextUrl);
    }, [state]);

    const retryFetchData = () => {
        // console.log('Retry data');
        if (state.data.length > 0) {
            getAllPokemons(state.nextUrl);
        } else {
            getAllPokemons(apiUrl);
        }
    }

    const loadMoreHandler = () => {
        // console.log('LOAD MORE', nextUrl);
        getAllPokemons(state.nextUrl);
    }

    const sortHandler = (filterName) => {
        setIsFiltering(true); 
        
        setTimeout(() => {
            dispatchState({ 
                type: 'SORT_DATA',
                name: filterName
            });

            setIsFiltering(false); 
        }, 500);
        
    }

    const onSearchHandler = (e) => {
        setTimeout(() => {
            setSearchKey(e.target.value);
        }, 500);
    }

    const changeViewHandler = (viewType)  => {
        setIsFiltering(true); 
        
        setTimeout(() => {
            setView(viewType);
            setIsFiltering(false); 
        }, 500);
    }

    const filterTypeHandler = (e) => {
        // console.log(e.target.value);
        setIsFiltering(true); 
        
        setTimeout(() => {
            setFilterType(e.target.value);
            setIsFiltering(false); 
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
        if (view === 'LIST') {
            content = (
                <Fragment>
                    <ul className={classes['list']}>
                        {
                            sortedPokemonList.length > 0 ? (
                                sortedPokemonList.map((item) => {
                                    return <PokemonItem key={item.id} item={item}></PokemonItem>
                                })
                            ) : (
                                <p style={{marginLeft: 30}}>No result found. Please try again.</p>
                            )
                        }
                    </ul>
                    <button className={classes.button} onClick={loadMoreHandler}>Load more</button>
                </Fragment>
            );
        } else if (view === 'TABLE') {
            content = (
                <Fragment>
                    <div className={classes['table-container']}>
                        <table id='pokedex' className={classes['pokemon-table']}>
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
                                    sortedPokemonList.length > 0 && (
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
                                    )
                                }
                            </tbody>
                        </table>
                        { sortedPokemonList.length <= 0 && <p style={{marginLeft: 30}}>No result found. Please try again.</p> }
                    </div>
                    <button className={classes.button} onClick={loadMoreHandler}>Load more</button>
                </Fragment>
                
            );
        }
    }

	return (
        <Fragment>
            <div className={`${classes['wrap-pokemon-list']} content ${isFiltering ? classes.filtering : ''}`}>
                <div className={classes['wrap-filter']}>
                    <div className={classes.filter}>
                        <div className={classes['wrap-ip']}>
                            <span>Name:</span><input type="text" className={classes.input} onChange={onSearchHandler}/>
                        </div>
                        <div className={classes['wrap-ip']}>
                            <span>Type:</span> 
                            <select className={classes.input} onChange={filterTypeHandler}>              
                                <option value=''>-All-</option>
                                {
                                    typeArr.map(type => (
                                        <option key={type} value={type}>{capitalizeFirstLetter(type)}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className={classes['wrap-btn']}>
                        <button onClick={() => changeViewHandler('LIST')} title="View list" className={`${classes.first} ${view === 'LIST' ? classes.active : ''}`}></button>
                        <button onClick={() => changeViewHandler('TABLE')} title="View table" className={`${classes.second} ${view === 'TABLE' ? classes.active : ''}`}></button>
                    </div>
                </div>
                {content}
                {state.data.length > 0 && state.isLoading && <LoadingIndicator/>} 
            </div>
        </Fragment>
    );
};

export default PokemonMainPage;
