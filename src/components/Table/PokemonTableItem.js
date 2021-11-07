import { useState, useCallback, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	capitalizeFirstLetter,
	convertPokemonId,
} from '../../helpers/helpers';
import classes from '../../scss/PokemonTableItem.module.scss'
        
const PokemonTableItem = (props) => {
	const { name, image, id, types, stats } = props;
    // const [pokemonTypes, setPokemonTypes] = useState([]);
    const [pokemonStats, setPokemonStats] = useState([]);
    
    useEffect(() => {
        let arrayStats = [];

        stats.forEach(item => {
            arrayStats.push({
                name: item.stat.name,
                stat: item.base_stat
            });
        });

        setPokemonStats(arrayStats);
    }, [stats]);

    // useEffect(() => {
    //     const typesArr = types.map((item) => item.type.name);
    //     setPokemonTypes(typesArr);
    // }, [types]);

    const getTotalStat = useCallback(() => {
        return pokemonStats.reduce((n, { stat }) => n + stat, 0);
    }, [pokemonStats]);

	return (
		<Fragment>
			<td>
                <img src={image} alt={name} className={classes.img}/>
                {convertPokemonId(id)}
            </td>
			<td  className={classes['cell-name']}>
                <Link to={`/pokemon/${name}`}>
                    {capitalizeFirstLetter(name)}
                </Link>
            </td>
			<td>
				<ul className={classes.types}>
					{types.length && types.map((color) => (
						<li key={color}>
							<Link
								to={`/pokemon/type/${color}`}
								className={classes[`color-${color}`]}
							>
								{color}
							</Link>
						</li>
					))}
				</ul>
			</td>
			<td style={{fontWeight: '500'}}>{getTotalStat()}</td>
			<td>{pokemonStats.length > 0 && (pokemonStats[0]).stat}</td>
			<td>{pokemonStats.length > 0 && (pokemonStats[1]).stat}</td>
			<td>{pokemonStats.length > 0 && (pokemonStats[2]).stat}</td>
            <td>{pokemonStats.length > 0 && (pokemonStats[3]).stat}</td>
            <td>{pokemonStats.length > 0 && (pokemonStats[4]).stat}</td>
            <td>{pokemonStats.length > 0 && (pokemonStats[5]).stat}</td>
		</Fragment>
	);
};

export default PokemonTableItem;
