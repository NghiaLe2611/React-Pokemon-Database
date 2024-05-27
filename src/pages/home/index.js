import { useState, useEffect, useMemo, useCallback, useReducer, Fragment, useRef } from 'react';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import { apiUrl, initialState, pokemonReducer } from '@/store/reducers/pokemonReducer';
import classes from '@/scss/PokemonMain.module.scss';
import { capitalizeFirstLetter } from '@/helpers';
import PokemonList from './PokemonList';
import PokemonTable from './PokemonTable';
import axios from 'axios';
import useDebounce from '@/hooks/useDebounce';

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

const PokemonMainPage = () => {
	const [state, dispatchState] = useReducer(pokemonReducer, initialState);
	const { data, isLoading, nextUrl, total, sortName, isFiltering, filterType, sortType, view } = state;
	const [searchKey, setSearchKey] = useState('');
	const debounceSearchKey = useDebounce(searchKey, 500);

	const sortedPokemonList = useMemo(() => {
		let sortableItems = [...data];

		const type = sortType;
		const key = sortName;

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
			sortableItems = [...data];
		}

		if (filterType.length) {
			sortableItems = sortableItems.filter((item) => item.types.includes(filterType) === true);
		} else {
			sortableItems = sortableItems.filter((item) => item.name);
		}

		if (debounceSearchKey.length) {
			sortableItems = sortableItems.filter(
				(item) => item.name.toLowerCase().indexOf(debounceSearchKey.toLowerCase()) > -1
			);
		}

		return sortableItems;
	}, [data, sortName, sortType, filterType, debounceSearchKey]);

	// =====Cách 1: LOAD all=====
	/*
		async function getAllPokemons() {
			const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
			const { results } = response.data;
			const pokemonDataPromises = results.map((result) => axios.get(result.url));
			const pokemonDataResponses = await Promise.all(pokemonDataPromises);
			const pokemonData = pokemonDataResponses.map((response) => response.data);
		}

		const getPokemonDetails = async () => {
			const details = await Promise.all(
				pokemonData.map(async (pokemon) => {
					const response = await fetch(pokemon.url);
					const data = await response.json();
					return data;
				})
			);
			setPokemonDetails(details);
		};
		*/

	// =====Cách 2: LOAD lần lượt=====
	async function getAllPokemons(url = 'https://pokeapi.co/api/v2/pokemon/') {
		console.log('Get all pokemons');

		const response = await axios.get(url);
		const { data } = response;
		const pokemonUrls = data.results.map((result) => result.url);
		
		dispatchState({ type: 'FETCH_INIT' });

		pokemonUrls.forEach(async (url) => {
			const pokemonResponse = await axios.get(url);
			const detail = pokemonResponse.data;
			const types = detail.types.map((item) => item.type.name);

			const pokemon = {
				id: detail.id,
				name: detail.name,
				image: detail.sprites.front_default,
				height: detail.height,
				weight: detail.weight,
				stats: detail.stats,
				types: types,
			};
			// setPokemonList((prevList) => [...prevList, pokemon]);
			dispatchState({
				type: 'FETCH_SUCCESS',
				payload: {
					count: data.count,
					list: [pokemon],
					nextUrl: data.next,
					hasMore: data.results.length > 0,
				},
			});
		});
	}

	// Scroll to top
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			// behavior: 'smooth',
		});
	}, []);

	useEffect(() => {
		const pokemonDataStorage = JSON.parse(localStorage.getItem('pokemonList')) || [];
		if (pokemonDataStorage.length <= 0) {
			getAllPokemons();
		}
	}, []);

	// Handle localStorage
	useEffect(() => {
		localStorage.setItem('pokemonList', JSON.stringify(data));
		localStorage.setItem('nextUrl', nextUrl);
		localStorage.setItem('total', total);
	}, [data, nextUrl, total]);

	// Infinite scrolling load more data
	useEffect(() => {
		const loadMoreData = async () => {
			if (!nextUrl || isLoading) return;
			dispatchState({ type: 'FETCH_INIT' });
			try {
				const res = await axios.get(nextUrl);
				const { results, next, count } = res.data;
				const urls = results.map((result) => result.url);

				urls.forEach(async (url) => {
					const pokemonResponse = await axios.get(url);
					const detail = pokemonResponse.data;
					const types = detail.types.map((item) => item.type.name);

					const pokemon = {
						id: detail.id,
						name: detail.name,
						image: detail.sprites.front_default,
						height: detail.height,
						weight: detail.weight,
						stats: detail.stats,
						types: types,
					};
					dispatchState({
						type: 'FETCH_SUCCESS',
						payload: {
							count: count,
							list: [pokemon],
							nextUrl: next,
							hasMore: results.length > 0,
						},
					});
				});
			} catch (err) {
				console.log(err);
				dispatchState({ type: 'FETCH_FAILURE' });
			}
		};

		const handleScroll = () => {
			const isBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 200;
			if (isBottom) {
				console.log('loadMoreData');
				loadMoreData();
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isLoading, nextUrl]);

	// Infinite scroll
	const loadMoreHandler = useCallback(() => {
		getAllPokemons(nextUrl);
	}, [nextUrl]);

	// Retry get data
	const retryFetchData = () => {
		// console.log('Retry data');
		if (data.length > 0) {
			getAllPokemons(nextUrl);
		} else {
			getAllPokemons(apiUrl);
		}
	};

	// Handle sort data
	const sortHandler = (filterName) => {
		dispatchState({ type: 'FILTERING_DATA', isFiltering: true });

		setTimeout(() => {
			dispatchState({
				type: 'SORT_DATA',
				name: filterName,
			});

			dispatchState({ type: 'FILTERING_DATA', isFiltering: false });
		}, 500);
	};

	// Handle search data
	const onSearchHandler = (e) => {
		setSearchKey(e.target.value);
	};

	// Handle view data
	const changeViewHandler = (viewType) => {
		dispatchState({ type: 'FILTERING_DATA', isFiltering: true });

		setTimeout(() => {
			dispatchState({ type: 'SET_VIEW_DATA', view: viewType});
			dispatchState({ type: 'FILTERING_DATA', isFiltering: false });
		}, 500);
	};

	// Handle filter data
	const filterTypeHandler = (e) => {
		// console.log(e.target.value);
		dispatchState({ type: 'FILTERING_DATA', isFiltering: true });
		setTimeout(() => {
			dispatchState({ type: 'FILTER_DATA', filterType: e.target.value });
			dispatchState({ type: 'FILTERING_DATA', isFiltering: false });
		}, 500);
	};

	const getClassName = useCallback(
		(filterName) => {
			if (filterName === sortName) {
				if (sortType === 'asc') {
					return classes.asc;
				} else if (sortType === 'desc') {
					return classes.desc;
				}
			}

			return "";
		},
		[sortName, sortType]
	);

	let content = isLoading && <LoadingIndicator type='fixed' />;

	if (state.error && data.length <= 0) {
		content = (
			<Fragment>
				<p style={{ backgroundColor: 'white', padding: '10px 20px' }}>{state.error}</p>
				<button className={classes.button} onClick={retryFetchData}>
					Retry
				</button>
			</Fragment>
		);
	}

	if (data.length > 0) {
		if (view === 'LIST') {
			content = <PokemonList data={sortedPokemonList} onLoadMore={loadMoreHandler} />;
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
		<div className={`${classes['wrap-pokemon-list']} content ${isFiltering ? classes.filtering : ''}`}>
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
						className={`${classes.first} ${view === 'LIST' ? classes.active : ''}`}></button>
					<button
						onClick={() => changeViewHandler('TABLE')}
						title='View table'
						className={`${classes.second} ${view === 'TABLE' ? classes.active : ''}`}></button>
				</div>
			</div>
			{content}
			{data.length > 0 && isLoading && <LoadingIndicator />}
		</div>
	);
};

export default PokemonMainPage;
