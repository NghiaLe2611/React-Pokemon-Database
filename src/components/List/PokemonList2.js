import { memo, useCallback, useEffect, useRef, useState } from 'react';
import PokemonItem from './PokemonItem2';
import axios from 'axios';
import classes from 'scss/PokemonList.module.scss';
import LoadingIndicator from 'components/UI/LoadingIndicator';

const LIMIT = 20;

const PokemonList2 = () => {
	const [data, setData] = useState([]);
	const [pokemonList, setPokemonList] = useState([]);
	const [nextUrl, setNextUrl] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [count, setCount] = useState(0);

	// Get init data
	const fetchData = useCallback(async () => {
		setIsLoading(true);

		try {
			const res = await axios(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${LIMIT}`);
			const { count, results, next } = res.data;
			setData(results);
			setNextUrl(next);
			setCount(count);
			setIsLoading(false);
		} catch (err) {
			console.log(err);
			setIsLoading(false);
		}
	}, [offset]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Get detail data by sequence
	const getAllPokemons = useCallback(async () => {
		if (data.length) {
			const urls = data.map((result) => result.url);
			console.log(urls);
			urls.forEach(async (url) => {
				const res = await axios.get(url);
				const detail = res.data;
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

				setPokemonList((prevList) => [...prevList, pokemon]);
			});
		}
	}, [data]);

	useEffect(() => {
		getAllPokemons();
	}, [getAllPokemons]);

	// Infinite scrolling load more data
	useEffect(() => {
		const handleScroll = () => {
			const isBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight;
			// console.log(window.innerHeight, window.scrollY, document.body.scrollHeight);
			if (isBottom) {
				setOffset((prev) => prev + 20);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [fetchData, nextUrl, offset]);

	if (!data.length && isLoading) {
		return <LoadingIndicator />;
	}

	return (
		<div className={`${classes['wrap-pokemon-list']} content`}>
			<ul className={classes['list']}>
				{pokemonList.map((item, index) => (
					<PokemonItem key={item.id} item={item} />
				))}
			</ul>

			{data.length > 0 ? <LoadingIndicator/> : null}
		</div>
	);
};

export default memo(PokemonList2);
