import axios from 'axios';
import { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import classes from '../scss/PokemonList.module.scss'
import PokemonItem from '../components/PokemonItem';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import SkeletonElement from '../components/UI/SkeletonElement';
import useFetch from '../hooks/useFetch';

const limit = 20;
const PokemonList = () => {
    const [offset, setOffset] = useState(0);
    const [nextUrl, setNextUrl] = useState(null);
    const [pokemonData, setPokemonData] = useState([]);
    const [pokemonList, setPokemonList] = useState([]);
    const [loadMore, setLoadMore] = useState(false);

    const loader = useRef();
    const onScreen = useOnScreen(loader, "-40px");

    const { isLoading, error, fetchData: fetchPokemons } = useFetch();

    // Get all pokemon data
    const getPokemonData = () => {
        console.log('Get pokemon list');
        fetchPokemons({
            url: `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
        }, (data) => {
            if (data) {
                setPokemonData(state => data.results);
                setNextUrl(state => data.next);

                const promises = [];
                const pokemonArray = [];
                
                // Get + extract detail for pokemon item
                for (let i = offset + 1; i <= offset + limit; i++) {
                    promises.push(
                        axios('https://pokeapi.co/api/v2/pokemon/' + i)
                    );
                }
                Promise.all(promises)
                    .then((results) => {
                        console.log('Get pokemon details');
                        results.forEach((res) => {
                            const info = res.data;
                            const types = info.types.map((item) => item.type.name);
        
                            const pokemon = {
                                id: info.id,
                                name: info.name,
                                types,
                                weight: info.weight,
                                height: info.height
                            };
        
                            pokemonArray.push(pokemon);
                        });
        
                        setPokemonList(arr => arr.concat(pokemonArray));
        
                    })
                    .catch((err) => {
                        console.log(err);
                    });   
            }
        });
    }

    useEffect(() => {
        console.log('getPokemonData');
        getPokemonData();
    }, [offset]);

    
    // Infinite scroll (auto fetch data when reached bottom)
    useEffect(() => {
        if (onScreen && pokemonList.length > 0 && !error) {
            
            if (nextUrl !== null) {
                setLoadMore(true);
                const timer = setTimeout(() => {
                    // console.log('infinite loading...');
                    setOffset(prevOffset => prevOffset += limit);
                }, 200);

                return () => {
                    clearTimeout(timer);
                    setLoadMore(false);
                };
            } 

            if (!nextUrl) {
                alert('No more data!');
            }
        }
    }, [onScreen]);

    const loadMorePokemon = () => {
        // console.log('load more');
        getPokemonData();
    }

    let content = <div style={{minHeight: '80vh'}}>{isLoading && <LoadingIndicator type='fixed'/>}</div>;

    if (pokemonData.length) {
        content = (
            <ul className={classes['list']}>
                {
                    pokemonData.map((item) => (
                        <li key={item.name}>
                            <SkeletonElement type="item"></SkeletonElement>
                        </li>
                    ))
                }
            </ul>
        )
    }
   
    if (pokemonList.length) {
        content = (
            <Fragment>
                <ul className={classes['list']}>
                    {
                        pokemonList.map((item) => {
                            return <PokemonItem key={item.id} item={item}></PokemonItem>
                        })
                    }
                </ul>
    
                {error &&  (
                    <p style={{textAlign: 'center'}}>You appear to be offline. Please check your network connection.<br/>
                        <button className={classes.refresh} onClick={loadMorePokemon}>Retry</button>
                    </p>
                )}
            </Fragment>
        );
    }

    if (error && !pokemonData.length) {
        content = <p>{error}</p>;
    }

    return (
        <div className={`${classes['wrap-pokemon-list']} content`}>
            {content}
            <div ref={loader} className="end" style={{display: error ? 'none' : 'block'}}></div>
            {loadMore && <LoadingIndicator/>}
        </div>
    )
};

export default PokemonList;