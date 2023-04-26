import { forwardRef, useRef, useCallback, memo, useEffect, useState, useReducer } from 'react';
import PokemonItem from './PokemonItem';
import classes from 'scss/PokemonList.module.scss';
import { initialState, pokemonReducer } from 'store/reducers/pokemonReducer';

const PokemonList = ({ data, onLoadMore }) => {
	const [state, dispatchState] = useReducer(pokemonReducer, initialState);
	const { isLoading, nextUrl } = state;
	const observer = useRef(null);
	const lastItemRef = useRef(null);

	// Infinite scrolling
	useEffect(() => {
		if (isLoading) return;

		if (observer.current) observer.current.disconnect();

		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && nextUrl) {
				dispatchState({ type: 'FETCH_INIT' });
			}
		});

		if (lastItemRef.current) observer.current.observe(lastItemRef.current);
	}, [isLoading, nextUrl]);

	useEffect(() => {
		if (isLoading && nextUrl) {
			// onLoadMore();
		}
	}, [isLoading, nextUrl, onLoadMore]);

	// useEffect(() => {
	// 	// Here you can fetch more data and update the list
	// 	// when the last item is intersecting
	// 	const observer = new IntersectionObserver(
	// 		(entries) => {
	// 			const target = entries[0];
	// 			if (target.isIntersecting) {
	// 				// console.log('Last item is intersecting!');
	// 			}
	// 		},
	// 		{ threshold: 1 }
	// 	);
	// 	if (lastItemRef.current) {
	// 		observer.observe(lastItemRef.current);
	// 	}
	// 	return () => {
	// 		observer.disconnect();
	// 	};
	// }, [lastItemRef]);

	return (
		<div>
			<ul className={classes['list']}>
				{data.length > 0 ? (
					data.map((item, index) => {
						if (data.length === index + 1) {
							return <PokemonItem key={item.id} item={item} ref={lastItemRef} />;
						} else {
							return <PokemonItem key={item.id} item={item} />;
						}
					})
				) : (
					<p style={{ marginLeft: 30 }}>No result found. Please try again.</p>
				)}
			</ul>
			{/* <button className={classes['load-btn']} onClick={onLoadMore}>
				Load more
			</button> */}
		</div>
	);
};

export default memo(PokemonList);
