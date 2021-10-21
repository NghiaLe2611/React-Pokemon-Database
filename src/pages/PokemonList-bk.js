import axios from 'axios';
import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
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
    useEffect(() => {
        console.log('Fetch pokemons');
        fetchPokemons({
            url: `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
        }, (data) => {
            if (data) {
                setPokemonData(data.results);
                setNextUrl(data.next);
            }
        })
    }, [fetchPokemons, offset]);

    // Get + extract detail for pokemon item
    useEffect(() => {
        const getPokemonList = async () => {
            const promises = [];
            const pokemonArray = [];

            console.log('Get pokemon list');

            for (let i = offset + 1; i <= offset + limit; i++) {
                promises.push(
                    await axios('https://pokeapi.co/api/v2/pokemon/' + i)
                );
            }
            Promise.all(promises)
                .then((results) => {
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

        getPokemonList();
    }, [offset]); 

    // Infinite scroll (auto fetch data when reached bottom)
    useEffect(() => {
        if (onScreen && pokemonList.length > 0) {
            setLoadMore(true);
            if (nextUrl !== null) {
                const timer = setTimeout(() => {
                    setOffset(prevOffset => prevOffset += limit);
                }, 500);

                return () => {
                    clearTimeout(timer);
                    setLoadMore(false);
                };
            } else {
                alert('No more data!');
            }
        }
    }, [onScreen]);

    const loadMoreHandler = async () => {
        console.log('LOAD MORE');
     }

    let content = <div style={{minHeight: '80vh'}}>{!error && <LoadingIndicator type='fixed'/>}</div>;

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
   
    if (pokemonList.length > 0) {
        content = (
            <Fragment>
                <ul className={classes['list']}>
                    {
                        pokemonList.map((item) => {
                            return <PokemonItem key={item.id} item={item}></PokemonItem>
                        })
                    }
                </ul>
    
                {error && pokemonData.length &&  (
                    <p style={{textAlign: 'center'}}>You appear to be offline. Please check your network connection.<br/>
                        <button onClick={loadMoreHandler}>Retry</button>
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
            {!error && <div ref={loader} className="end"></div>}
            {loadMore && !error && <LoadingIndicator/>}
        </div>
    )
};

export default PokemonList;