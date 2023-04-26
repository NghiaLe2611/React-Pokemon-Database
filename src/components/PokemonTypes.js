import { memo } from 'react';
import classes from './PokemonTypes.module.scss';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from 'helpers/helpers';

const PokemonTypes = ({ types }) => {
	return (
		<ul className={classes.types}>
			{types &&
				types.map((color) => (
					<li key={color}>
						<Link to={`/pokemon/type/${color}`} className={classes[`color-${color}`]}>
							{capitalizeFirstLetter(color)}
						</Link>
					</li>
				))}
		</ul>
	);
};

export default memo(PokemonTypes);
