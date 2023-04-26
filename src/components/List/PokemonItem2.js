import { Fragment, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import classes from 'scss/PokemonItem.module.scss';
import { capitalizeFirstLetter, convertPokemonId, getLinkSuggestion } from '../../helpers/helpers';

const PokemonItem = (props) => {
	const { id, name, types } = props.item;
	return (
		<li className={classes.item}>
			{props.type !== 'filtered' ? (
				<Fragment>
					<figure className={classes.image}>
						<Link to={`/pokemon/${id}`}>
							<img
								src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${convertPokemonId(
									id
								)}.png`}
								alt={name}
							/>
						</Link>
					</figure>
					<div className={classes['pokemon-info']}>
						<p>#{convertPokemonId(id)}</p>
						<h2>{capitalizeFirstLetter(name)}</h2>
						<ul className={classes.types}>
							{types.map((color) => (
								<li key={color}>
									<Link to={`/pokemon/type/${color}`} className={classes[`color-${color}`]}>
										{capitalizeFirstLetter(color)}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<figure>
						<Link
							className={classes.thumb}
							to={{
								pathname: `/pokemon/${getLinkSuggestion(props.item)}`,
								state: { id: props.item },
							}}>
							<img
								src={`https://img.pokemondb.net/artwork/large/${getLinkSuggestion(props.item)}.jpg`}
								alt={name}
							/>
						</Link>
					</figure>
				</Fragment>
			)}
		</li>
	);
};

export default PokemonItem;
