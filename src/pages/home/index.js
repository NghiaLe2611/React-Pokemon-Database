/* eslint-disable react-hooks/rules-of-hooks */
import classes from '@/scss/PokemonMain.module.scss';
import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PokemonItem from './PokemonItem';
import { useEffect, useState } from 'react';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import PokemonList from './PokemonList';

const fetchPokemonDetail = async (url) => {
	const { data } = await axios.get(url);
	const types = data.types.map((item) => item.type.name);

	return {
		id: data.id,
		name: data.name,
		image: data.sprites.front_default,
		height: data.height,
		weight: data.weight,
		stats: data.stats,
		types,
	};
};

const usePokemonDetails = (pokemonUrls) => {
	console.log(222, pokemonUrls);
	const queries = pokemonUrls.map((url) => ({
		queryKey: ['pokemon', url],
		queryFn: () => fetchPokemonDetail(url),
        // cacheTime: 300000 // xác định khoảng thời gian dữ liệu được lưu trữ trong bộ nhớ cache kể từ lần cuối cùng nó được truy cập. Sau khoảng thời gian này, dữ liệu sẽ bị xóa khỏi bộ nhớ cache.
		staleTime: 1000 * 60 * 5, // xác định khoảng thời gian dữ liệu được xem là "mới" (fresh). Trong khoảng thời gian này, React Query sẽ không tự động gọi lại API để lấy dữ liệu mới.
		refetchOnWindowFocus: false, // xác định liệu có nên gọi lại API để lấy dữ liệu mới khi cửa sổ trình duyệt lấy lại tiêu điểm hay không
		refetchOnReconnect: false, // xác định liệu có nên gọi lại API để lấy dữ liệu mới khi trình duyệt khôi phục kết nối mạng hay không.
		refetchOnMount: false, // xác định liệu có nên gọi lại API để lấy dữ liệu mới khi component được mount hay không
	}));

	const results = useQueries({ queries });

	const isLoading = results.some((result) => result.isLoading);
	const isError = results.some((result) => result.isError);
	const data = results.map((result) => result.data).filter(Boolean);

	// Sort the data by Pokémon ID
	const sortedData = data.sort((a, b) => a.id - b.id);

	return { isLoading, isError, data: sortedData };
};

const PokemonMainPage = () => {
	const [urls, setUrls] = useState([]);
	const { isLoading, isError, data } = usePokemonDetails(urls);

	useEffect(() => {
		async function getPokemonUrls() {
			const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
			const pokemonUrls = response.data.results.map((result) => result.url);
			console.log(123, pokemonUrls);
			setUrls(pokemonUrls);
		}

		getPokemonUrls();
	}, []);

	if (isLoading) {
		return (
			<div>
				<LoadingIndicator />
			</div>
		);
	}

	return (
		<div className={`${classes['wrap-pokemon-list']} content`}>
			{/* <div className={classes['wrap-filter']}>
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
			</div> */}

			<PokemonList data={data} />
		</div>
	);
};

export default PokemonMainPage;
