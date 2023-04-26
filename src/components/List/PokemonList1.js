import axios from 'axios';
import { useState, useEffect, useRef, Fragment, memo, useCallback } from 'react';
import useOnScreen from '../../hooks/useOnScreen';
import PokemonItem from './PokemonItem1';
import LoadingIndicator from '../UI/LoadingIndicator';
import SkeletonElement from '../UI/SkeletonElement';
import useFetch from '../../hooks/useFetch';
import SearchPokemon from '../SearchPokemon';
import classes from '../../scss/PokemonList.module.scss';
import usePrevious from 'hooks/usePrevious';

const LIMIT = 20;

const PokemonList1 = () => {
	const pokemonListStorage = JSON.parse(localStorage.getItem('pokemonList')) || [];
	const [offset, setOffset] = useState(() => {
		const savedOffset = parseInt(localStorage.getItem('offset'));
		return savedOffset || 0;
	});
	const [nextUrl, setNextUrl] = useState(() => {
		const savedNextUrl = localStorage.getItem('nextUrl');
		return savedNextUrl || null;
	});
	const [pokemonData, setPokemonData] = useState([]);
	const [pokemonList, setPokemonList] = useState(() => {
		const savedData = localStorage.getItem('pokemonList');
		const initialValue = JSON.parse(savedData);
		return initialValue || [];
	});
	const [loadMore, setLoadMore] = useState(false);
	const [filteredListPokemon, setFilteredListPokemon] = useState(null);

	const loader = useRef();
	const onScreen = useOnScreen(loader, '50px');
	const prevPokemonData = usePrevious(pokemonData);
	const { isLoading, error, fetchData: fetchPokemons } = useFetch();

	// Get all pokemon data
	const getPokemonData = useCallback(() => {
		console.log('Get pokemon list');
		fetchPokemons(
			{
				url: `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${LIMIT}`,
			},
			(res) => {
				if (res) {
					setPokemonData((state) => res.results);
					setNextUrl((state) => res.next);
				}
			}
		);
	}, [fetchPokemons, offset]);

	// Get pokemon data
	useEffect(() => {
		// console.log('getPokemonData');
		getPokemonData();
		localStorage.setItem('offset', offset);
	}, [offset, getPokemonData]);

	// Get list detail pokemon data
	useEffect(() => {
		function getDetailData() {
			const promises = [];
			const pokemonArray = [];

			if (pokemonListStorage.length > 0 && !onScreen) return;

			// Get + extract detail for pokemon item
			for (let i = offset + 1; i <= offset + LIMIT; i++) {
				promises.push(axios('https://pokeapi.co/api/v2/pokemon/' + i));
			}
			Promise.all(promises)
				.then((results) => {
					// console.log('Get pokemon details');
					results.forEach((res) => {
						const info = res.data;
						const types = info.types.map((item) => item.type.name);

						const pokemon = {
							id: info.id,
							name: info.name,
							types,
							weight: info.weight,
							height: info.height,
						};

						pokemonArray.push(pokemon);
					});

					setPokemonList((arr) => arr.concat(pokemonArray));
				})
				.catch((err) => {
					console.log(err);
				});
		}
        
        if (prevPokemonData && pokemonData.length) {
            if (JSON.stringify(prevPokemonData) !== JSON.stringify(pokemonData)) {
                getDetailData();
            }
        }
	}, [offset, onScreen, pokemonData, prevPokemonData, pokemonListStorage.length]);

	useEffect(() => {
		localStorage.setItem('pokemonList', JSON.stringify(pokemonList));
	}, [pokemonList]);

	useEffect(() => {
		localStorage.setItem('nextUrl', nextUrl);
	}, [nextUrl]);

	// Infinite scroll using on screen
	useEffect(() => {
		if (onScreen && pokemonList.length > 0 && !error) {
			if (nextUrl != null && (!filteredListPokemon || filteredListPokemon.length >= 0)) {
				setLoadMore(true);

				const timer = setTimeout(() => {
					// console.log('infinite loading...');
					setOffset((prevOffset) => (prevOffset += LIMIT));
				}, 500);

				return () => {
					clearTimeout(timer);
				};
			} else {
				alert('No more data');
			}
		}

		return () => {
			setLoadMore(false);
		};
	}, [error, filteredListPokemon, nextUrl, onScreen, pokemonList.length]); // error, filteredListPokemon, pokemonList.length, nextUrl

	const loadMorePokemon = () => {
		// console.log('load more');
		getPokemonData();
	};

	const getFilteredListPokemon = (data) => {
		// console.log(data);
		setTimeout(() => {
			setFilteredListPokemon(data);
		}, 500);
	};

	let content = <div style={{ minHeight: '80vh' }}>{isLoading && <LoadingIndicator type='fixed' />}</div>;

	if (pokemonData.length) {
		content = (
			<ul className={classes['list']}>
				{pokemonData.map((item) => (
					<li key={item.name}>
						<SkeletonElement type='img'></SkeletonElement>
						<SkeletonElement type='text'></SkeletonElement>
						<SkeletonElement type='heading'></SkeletonElement>
						<SkeletonElement type='types'></SkeletonElement>
					</li>
				))}
			</ul>
		);
	}

	if (pokemonList.length) {
		content = (
			<Fragment>
				<ul className={classes['list']}>
					{pokemonList.map((item) => {
						return <PokemonItem key={item.id} item={item}></PokemonItem>;
					})}
				</ul>

				{error && (
					<p style={{ textAlign: 'center' }}>
						You appear to be offline. Please check your network connection.
						<br />
						<button className={classes.refresh} onClick={loadMorePokemon}>
							Retry
						</button>
					</p>
				)}
			</Fragment>
		);
	}

	if (error && !pokemonData.length) {
		content = <p>{error}</p>;
	}

	let filteredListContent = (
		<ul className={classes['list']}>
			{filteredListPokemon &&
				filteredListPokemon.map((name) => <PokemonItem key={name} item={name} type='filtered' />)}
		</ul>
	);

	return (
		<div className={`${classes['wrap-pokemon-list']} content`}>
			<SearchPokemon searchHandler={getFilteredListPokemon} />
			{filteredListPokemon ? (
				filteredListPokemon.length > 0 ? (
					filteredListContent
				) : (
					<p>No results match</p>
				)
			) : (
				<Fragment>
					{content}
					{loadMore && (
						<div style={{ marginTop: '-30px' }}>
							<LoadingIndicator />
						</div>
					)}
				</Fragment>
			)}
			<div
				ref={loader}
				className='end'
				style={{
					display: error && pokemonList.length ? 'none' : 'block',
				}}></div>
		</div>
	);
};

export default memo(PokemonList1);
