import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router';
import LoadingIndicator from 'components/UI/LoadingIndicator';
import { capitalizeFirstLetter, getLastStringSegment } from 'helpers/helpers';
import useFetch from 'hooks/useFetch';
import classes from 'scss/PokemonType.module.scss';
import prosIcon from 'assets/images/icon-pros.svg';
import consIcon from 'assets/images/icon-cons.svg';

const PokemonType = () => {
	const { pokemonType } = useParams();
    const [typeData, setTypeData] = useState(null);

    const { isLoading, error, fetchData: fetchType } = useFetch();

    useEffect(() => {
        fetchType({
            url: `https://pokeapi.co/api/v2/type/${pokemonType}`
        }, (data) => {
            if (data) {
                setTypeData(data);
            }
        })
    }, [fetchType, pokemonType]);

    let content = isLoading && <div style={{minHeight: '80vh'}}>{<LoadingIndicator type='fixed'/>}</div>;

    if (error) {
        content = <p>{error}</p>
    }

    if (!isLoading && !error && typeData) {
        content = (
            <Fragment>
                <h1 className={classes.title}>{capitalizeFirstLetter(typeData.name)} <span>(type)</span></h1>
                <Fragment>
                    <h3 className={classes.heading}>Attack pros & cons</h3>
                    <div className={classes.trait}>
                        <p>
                            <span className={`${classes.icon} ${classes.pros}`}><img src={prosIcon} alt="pros" /></span>
                            {capitalizeFirstLetter(typeData.name)} moves are super-effective against:
                        </p>
                        <ul className={classes.types}>
                            {
                                typeData['damage_relations'].double_damage_to ? typeData['damage_relations'].double_damage_to.map(item => (
                                    <li key={item.name}>
                                        <a className={classes[`color-${item.name}`]} href={`/pokemon/type/${item.name}`}>{capitalizeFirstLetter(item.name)}</a>
                                    </li>
                                )) : null
                            }
                        </ul>
                        <p>
                            <span className={`${classes.icon} ${classes.cons}`}><img src={consIcon} alt="cons" /></span>
                            {capitalizeFirstLetter(typeData.name)} moves are not very effective against:
                        </p>
                        <ul className={classes.types}>
                            {
                                typeData['damage_relations'].half_damage_to ? typeData['damage_relations'].half_damage_to.map(item => (
                                    <li key={item.name}>
                                        <a className={classes[`color-${item.name}`]} href={`/pokemon/type/${item.name}`}>{capitalizeFirstLetter(item.name)}</a>
                                    </li>
                                )) : null
                            }
                        </ul>
                    </div>
                    <h3 className={classes.heading}>Defense pros & cons</h3>
                    <div className={classes.trait}>
                        <p>
                            <span className={`${classes.icon} ${classes.pros}`}><img src={prosIcon} alt="pros" /></span>
                            These types are not very effective against {capitalizeFirstLetter(typeData.name)} Pokémon:
                        </p>
                        <ul className={classes.types}>
                            {
                                typeData['damage_relations'].half_damage_from ? typeData['damage_relations'].half_damage_from.map(item => (
                                    <li key={item.name}>
                                        <a className={classes[`color-${item.name}`]} href={`/pokemon/type/${item.name}`}>{capitalizeFirstLetter(item.name)}</a>
                                    </li>
                                )) : null
                            }
                        </ul>
                        <p>
                            <span className={`${classes.icon} ${classes.cons}`}><img src={consIcon} alt="cons" /></span>
                            These types are super effective against {capitalizeFirstLetter(typeData.name)} Pokémon:
                        </p>
                        <ul className={classes.types}>
                            {
                                typeData['damage_relations'].double_damage_from ? typeData['damage_relations'].double_damage_from.map(item => (
                                    <li key={item.name}>
                                        <a className={classes[`color-${item.name}`]} href={`/pokemon/type/${item.name}`}>{capitalizeFirstLetter(item.name)}</a>
                                    </li>
                                )) : null
                            }
                        </ul>
                    </div>
                    <h3 className={classes.heading}>{capitalizeFirstLetter(typeData.name)} Pokemon</h3>
                    <div className={classes.list}>
                        {
                            typeData.pokemon.length ? typeData.pokemon.map(item => (
                                <a href={`/pokemon/${item.pokemon.name}`} key={item.pokemon.name} className={classes.item}>
                                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getLastStringSegment(item.pokemon.url)}.png`} alt={item.pokemon.name} />
                                    <span style={{padding: 5}}>{capitalizeFirstLetter(item.pokemon.name)}</span>
                                </a>
                            )) : <p>No result</p>
                        }
                    </div>
                </Fragment>
            </Fragment>
        );
    }

	return (
        <div className={classes['wrap-pokemon-type']}>
            {content}
        </div>
    );
};

export default PokemonType;
