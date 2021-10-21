import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classes from '../scss/PokemonItem.module.scss';
import { capitalizeFirstLetter, convertPokemonId } from '../helpers/helpers';

const PokemonItem = (props) => {
    const { id, name, types } = props.item;


    return (
        <li className={classes.item}>
            <Fragment>
                <figure>
                    <Link to={{
                        pathname: `/pokemon/${id}`,
                        state: { id: id }
                    }}>
                        <img src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${convertPokemonId(id)}.png`} alt={name} />
                    </Link>
                </figure>
                <div className={classes['pokemon-info']}>
                    <p>#{convertPokemonId(id)}</p>
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