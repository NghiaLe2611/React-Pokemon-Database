import { forwardRef, memo } from 'react';
import PokemonItem from 'components/List/PokemonItem';
import classes from 'scss/PokemonList.module.scss';

const PokemonList = forwardRef(({ data, onLoadMore }, ref) => {
	return (
		<div ref={ref}>
			<ul className={classes['list']}>
				{data.length > 0 ? (
					data.map((item, index) => {
						if (data.length === index + 1) {
							return <PokemonItem key={item.id} item={item} ref={ref} />;
						} else {
							return <PokemonItem key={item.id} item={item} />;
						}
					})
				) : (
					<p style={{ marginLeft: 30 }}>No result found. Please try again.</p>
				)}
			</ul>
			<button className={classes['load-btn']} onClick={onLoadMore}>
				Load more
			</button>
		</div>
	);
});

export default memo(PokemonList);
