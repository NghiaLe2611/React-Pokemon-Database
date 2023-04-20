import { useState, useEffect, useMemo, useCallback, useReducer, Fragment, useRef } from 'react';
import LoadingIndicator from 'components/UI/LoadingIndicator';
import PokemonItem from 'components/List/PokemonItem';
import PokemonTableItem from 'components/Table/PokemonTableItem';
import { pokemonReducer } from 'store/reducers/pokemonReducer';
import classes from 'scss/PokemonMain.module.scss';
import { capitalizeFirstLetter } from 'helpers/helpers';
import PokemonList from './PokemonList';
import PokemonTable from './PokemonTable';

const typeArr = [
	'normal',
	'fire',
	'water',
	'electric',
	'grass',
	'ice',
	'fighting',
	'poison',
	'ground',
	'flying',
	'psychic',
	'bug',
	'rock',
	'ghost',
	'dragon',
	'steel',
	'fairy',
];

const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=30';

const PokemonMainPage = () => {
	const [state, dispatchState] = useReducer(pokemonReducer, {
		data: JSON.parse(localStorage.getItem('pokemonTableData')) || [],
		isLoading: false,
		error: null,
		nextUrl: localStorage.getItem('nextUrl') || apiUrl,
		sortName: 'id',
		sortType: 'asc',
	});
	const [filterType, setFilterType] = useState('');
	const [isFiltering, setIsFiltering] = useState(false);
	const [searchKey, setSearchKey] = useState('');
	const [view, setView] = useState('LIST');

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
			sortableItems = sortableItems.filter((item) => item.types.includes(filterType) === true);
		} else {
			sortableItems = sortableItems.filter((item) => item.name);
		}

		if (searchKey.length) {
			sortableItems = sortableItems.filter(
				(item) => item.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
			);
		}

		return sortableItems;
	}, [state.data, state.sortName, state.sortType, filterType, searchKey]);

	const getAllPokemons = async (url) => {
		const fetchData = async () => {
			const response = await fetch(url, {
				method: 'GET',
			});

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
						const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
						const detail = await res.json();
						const types = detail.types.map((item) => item.type.name);

						const pokemonInfo = {
							id: detail.id,
							name: detail.name,
							stats: detail.stats,
							types: types,
							image: detail.sprites.front_default,
						};
						pokemonList = [...pokemonList, pokemonInfo];
					}

					dispatchState({
						type: 'FETCH_SUCCESS',
						payload: {
							list: pokemonList,
							nextUrl: data.next,
						},
					});
				}

				createPokemonObject(data.results);
			}
		} catch (err) {
			dispatchState({
				type: 'FETCH_FAILURE',
				error: err.message,
			});
		}
	};

	// Infinite scroll
	const scrollRef = useRef(null);

	useEffect(() => {
		const onScroll = () => {
			const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
			if (scrollTop + clientHeight === scrollHeight) {
				console.log('Reached bottom of container!');
			}
		};

		if (state.data && state.data.length > 0) {
			console.log(state.data);
			window.addEventListener('scroll', onScroll);
		}

		return () => window.removeEventListener('scroll', onScroll);
	}, [state.data]);

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
	};

	const loadMoreHandler = () => {
		// console.log('LOAD MORE', nextUrl);
		getAllPokemons(state.nextUrl);
	};

	const sortHandler = (filterName) => {
		setIsFiltering(true);

		setTimeout(() => {
			dispatchState({
				type: 'SORT_DATA',
				name: filterName,
			});

			setIsFiltering(false);
		}, 500);
	};

	const onSearchHandler = (e) => {
		setTimeout(() => {
			setSearchKey(e.target.value);
		}, 500);
	};

	const changeViewHandler = (viewType) => {
		setIsFiltering(true);

		setTimeout(() => {
			setView(viewType);
			setIsFiltering(false);
		}, 500);
	};

	const filterTypeHandler = (e) => {
		// console.log(e.target.value);
		setIsFiltering(true);

		setTimeout(() => {
			setFilterType(e.target.value);
			setIsFiltering(false);
		}, 500);
	};

	const getClassName = useCallback(
		(filterName) => {
			if (filterName === state.sortName) {
				if (state.sortType === 'asc') {
					return classes.asc;
				} else if (state.sortType === 'desc') {
					return classes.desc;
				}
			}

			return;
		},
		[state.sortName, state.sortType]
	);

	let content = state.isLoading && <LoadingIndicator />;

	if (state.error && state.data.length <= 0) {
		content = (
			<Fragment>
				<p style={{ backgroundColor: 'white', padding: '10px 20px' }}>{state.error}</p>
				<button className={classes.button} onClick={retryFetchData}>
					Retry
				</button>
			</Fragment>
		);
	}

	if (state.data.length > 0) {
		if (view === 'LIST') {
			content = <PokemonList data={sortedPokemonList} onLoadMore={loadMoreHandler} ref={scrollRef} />;
		} else if (view === 'TABLE') {
			content = (
				<PokemonTable
					data={sortedPokemonList}
					onLoadMore={loadMoreHandler}
					sortHandler={sortHandler}
					getClassName={getClassName}
				/>
			);
		}
	}

	return (
		<div
			className={`${classes['wrap-pokemon-list']} content ${isFiltering ? classes.filtering : ''}`}
		>
			<div className={classes['wrap-filter']}>
				<div className={classes.filter}>
					<div className={classes['wrap-ip']}>
						<span>Name:</span>
						<input type='text' className={classes.input} onChange={onSearchHandler} placeholder='Search' />
					</div>
					<div className={classes['wrap-ip']}>
						<span>Type:</span>
						<select className={classes.input} onChange={filterTypeHandler}>
							<option value=''>-All-</option>
							{typeArr.map((type) => (
								<option key={type} value={type}>
									{capitalizeFirstLetter(type)}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className={classes['wrap-btn']}>
					<button
						onClick={() => changeViewHandler('LIST')}
						title='View list'
						className={`${classes.first} ${view === 'LIST' ? classes.active : ''}`}
					></button>
					<button
						onClick={() => changeViewHandler('TABLE')}
						title='View table'
						className={`${classes.second} ${view === 'TABLE' ? classes.active : ''}`}
					></button>
				</div>
			</div>
			{content}
			{state.data.length > 0 && state.isLoading && <LoadingIndicator />}
		</div>
	);
};

export default PokemonMainPage;
