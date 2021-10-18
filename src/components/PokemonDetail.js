import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import classes from '../scss/PokemonDetail.module.scss';
import LoadingIndicator from './UI/LoadingIndicator';
import { capitalizeFirstLetter, convertPokemonInfo, formatStatString } from '../helpers/helpers';
import styled, { keyframes, css } from 'styled-components';

const BASE_MAX_STAT = 180;

// Animation Progress Bar using styled-components
const progressAnimation = keyframes`
    from { width: 0; }
    to { width: ${props => `${props.value/BASE_MAX_STAT * 100}%`} }
`;

const ProgressBar = styled.div`
    width: ${props => `${props.value/BASE_MAX_STAT * 100}%`};
    animation: ${css`${progressAnimation} 1s ease`};
    background-color:  ${props => {
        if (props.value <= 30) return '#f34444';
        if (props.value > 30 && props.value <= 60) return '#ff7f0f';
        if (props.value > 60 && props.value <= 90) return '#ffdd57';
        if (props.value > 90 && props.value <= 120) return '#a0e515';
        if (props.value > 120 && props.value <= 150) return '#23cd5e';
        if (props.value > 150 && props.value <= 180) return '#00c2b8';
    }};
`;

const PokemonDetail = () => {
    const { pokemonId } = useParams();

    const { data, loading, error } = useAxios({
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
    });
    const [pokemonDetail, setPokemonDetail] = useState(null);

    useEffect(() => {
        if (data !== null) {
            setPokemonDetail(data);
        }
    }, [data]);

    const types = pokemonDetail ? pokemonDetail.types.map((item) => item.type.name) : [];

    const stats = useMemo(() => {
        let arrayStats = [];
        if (pokemonDetail) {
            pokemonDetail.stats.forEach(item => {
                arrayStats.push({
                    name: item.stat.name,
                    stat: item.base_stat
                });
            });
          
            return arrayStats;
        }
        return [];
    }, [pokemonDetail]);

    // console.log(types)

    let pokemonNumber = `00${pokemonId}`;

    if (pokemonId.toString().length >= 2 && pokemonId.toString().length < 3) {
        pokemonNumber = `0${pokemonId}`
    }

    if (pokemonId.toString().length >= 3) {
        pokemonNumber = `${pokemonId}`
    }

    let content = <LoadingIndicator/>;

    if (!loading && !error && data) {
        content = (
            <Fragment>
                <h1 className={classes.title}>{capitalizeFirstLetter(pokemonDetail.species.name)}</h1>
                <div className={classes['img']}>
                    <img src={`https://img.pokemondb.net/artwork/${pokemonDetail.name}.jpg`} alt="" />
                </div>
                <div className={classes['wrap-pokemon-info']}>
                    <h3 className={classes.heading}>Pokédex data</h3>
                    <table className={classes['table-data']}>
                        <tbody>
                            <tr>
                                <td>National №</td>
                                <td><strong>{pokemonNumber}</strong></td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td>
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
                                </td>
                            </tr>
                            <tr>
                                <td>Height</td>
                                <td>{pokemonDetail.height/10}m ({convertPokemonInfo('H', pokemonDetail.height)})</td>
                            </tr>
                            <tr>
                                <td>Weight</td>
                                <td>{pokemonDetail.weight/10}kg ({convertPokemonInfo('W', pokemonDetail.weight)} lbs)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={classes['wrap-pokemon-stats']}>
                    <h3 className={classes.heading}>Base stats</h3>
                    <table className={classes['table-stat']}>
                        <tbody>
                            {
                                stats.map(item => (
                                    <tr key={item.name}>
                                        <td>{formatStatString(item.name)}</td>
                                        <td>{item.stat}</td>
                                        <td className={classes['stat-bar']}><ProgressBar value={item.stat}/></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </Fragment>
        )
    }

    if (error) {
        content = <p>{error}</p>
    }


    return (
       <div className={classes['wrap-pokemon-detail']}>
           {content}
       </div>
    )
};

export default PokemonDetail;