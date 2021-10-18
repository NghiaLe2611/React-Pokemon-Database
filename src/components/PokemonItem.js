import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classes from '../scss/PokemonItem.module.scss';
import { capitalizeFirstLetter } from '../helpers/helpers';

const PokemonItem = (props) => {
    const { id, name, types } = props.item;
    let pokemonId = `00${id}`;

    if (id.toString().length >= 2 && id.toString().length < 3) {
        pokemonId = `0${id}`
    }

    if (id.toString().length >= 3) {
        pokemonId = `${id}`
    }

    return (
        <li className={classes.item}>
            <Fragment>
                <figure>
                    <Link to={`/pokemon/${id}`}>
                        <img src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonId}.png`} alt={name} />
                    </Link>
                </figure>
                <div className={classes['pokemon-info']}>
                    <p>#{pokemonId}</p>
                    <h2>{capitalizeFirstLetter(name)}</h2>
                    <ul className={classes.types}>
                        {
                            types.map(color => (
                                <li key={color}>
                                    <Link to={`/pokemon/type/${color}`} className={classes[`color-${color}`]}>
                                        {capitalizeFirstLetter(color)}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </Fragment>
        </li>
    );
};

export default PokemonItem;