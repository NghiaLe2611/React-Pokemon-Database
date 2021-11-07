import { useState, useEffect, useMemo, Fragment } from 'react';
import { useCallback } from 'react/cjs/react.development';
import classes from '../scss/PokemonTable.module.scss';
import PokemonTableItem from './PokemonTableItem';
import LoadingIndicator from './UI/LoadingIndicator';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPokemonData } from '../store/pokemon-actions';

const PokemonTableList = () => {
    const dispatch = useDispatch();

    const isLoading = useSelector(state => state.ui.isLoading);
    const error = useSelector(state => state.ui.error);
    const pokemons = useSelector(state => state.pokemons.pokemonList);
    const nextUrl = useSelector(state => state.pokemons.nextUrl);

    const [pokemonList, setPokemonList] = useState([]);
    
    const [orderBy, setOrderBy] = useState({
        name: 'id', type: 'asc'
    });
    
    const [isSorting, setIsSorting] = useState(false);

    const sortedPokemonList = useMemo(() => {
		let sortableItems = [...pokemonList];

        const type = orderBy.type;
        const key = orderBy.name;

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
            sortableItems = [...pokemonList];
        }


		return sortableItems;
	}, [pokemonList, orderBy]);

    useEffect(() => {
        const pokemonDataStorage = JSON.parse(localStorage.getItem('pokemonTableData')) || [];

        if (pokemonDataStorage.length <= 0) {
            console.log('Get all pokemons');
            dispatch(fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=10'));
        } 
    }, [dispatch]);

    useEffect(() => {
        setPokemonList(pokemons);
        localStorage.setItem('pokemonTableData', JSON.stringify(pokemons));
    }, [pokemons]);

    const retryFetchData = () => {
        if (pokemonList.length > 0) {
            dispatch(fetchPokemonData(nextUrl));
        } else {
            dispatch(fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=10'));
        }
    }

    const loadMoreHandler = () => {
        // console.log('LOAD MORE', nextUrl);
        dispatch(fetchPokemonData(nextUrl));
    }

    const sortHandler = (filterName) => {
        setIsSorting(true); 
        
        setTimeout(() => {
            if (filterName === orderBy.name) {
                if (orderBy.type === '') {
                    setOrderBy(order => order = {
                        ...order, type: 'asc'
                    })
                } else if (orderBy.type === 'asc') {
                    setOrderBy(order => order = {
                        ...order, type: 'desc'
                    })
                } else if (orderBy.type === 'desc') {
                    setOrderBy(order => order = {
                        name: 'id', type: 'asc'
                    })
                }  
            } else {
                setOrderBy(order => order = {
                    name: filterName, type: 'asc'
                })
            }

            setIsSorting(false); 
        }, 500);
        
    }

    const getClassName = useCallback((filterName) => {
        if (filterName === orderBy.name) {
            if (orderBy.type === 'asc') {
                return classes.asc;
            }
            else if (orderBy.type === 'desc') {
                return classes.desc;
            }
        }

        return;
    }, [orderBy]);


    let content = (<LoadingIndicator/>);

    if (error && pokemonList.length <= 0) {
        content = (
            <Fragment>
                <p style={{backgroundColor: 'white', padding: '10px 20px'}}>{error}</p>
                <button className={classes.button} onClick={retryFetchData}>Retry</button>
            </Fragment>
        );
    }

    if (pokemonList.length > 0) {
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
            {pokemonList.length > 0 && isLoading && <LoadingIndicator/>}
		</Fragment>
	);
};

export default PokemonTableList;