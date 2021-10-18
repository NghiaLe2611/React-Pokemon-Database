import axios from 'axios';
import { useState, useEffect, useRef, useCallback } from 'react';
import useAxios from '../hooks/useAxios';
import useOnScreen from '../hooks/useOnScreen';
import classes from '../scss/PokemonList.module.scss'
import PokemonItem from './PokemonItem';
import LoadingIndicator from './UI/LoadingIndicator';
import SkeletonElement from './UI/SkeletonElement';

const limit = 20;

const PokemonList = () => {
    const [offset, setOffset] = useState(0);
    const [nextUrl, setNextUrl] = useState(null);

    const [pokemonData, setPokemonData] = useState([]);
    const [pokemonList, setPokemonList] = useState([]);
    const [loadMore, setLoadMore] = useState(false);

    const loader = useRef();
    const onScreen = useOnScreen(loader, "-40px");

    const { data, error } = useAxios({
        url: `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
    });

    // Get all pokemon data
    useEffect(() => {
        if (data !== null) {
            setPokemonData(data.results);
            setNextUrl(data.next);
        }
    }, [data, offset]);

    // Get + extract detail for pokemon list
   const getPokemonList = useCallback(async () => {
		const promises = [];
		const pokemonArray = [];

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
                        // image: info.sprites['front_default'],
                    };

                    pokemonArray.push(pokemon);
                });

                setPokemonList((arr) => arr.concat(pokemonArray));
            })
            .catch((err) => {
                console.log(err);
            });
            
   }, [offset]);

    useEffect(() => {
        getPokemonList();
    }, [offset, getPokemonList]);

    // Infinite scroll (auto fetch data when reached bottom)
    useEffect(() => {
        if (pokemonList.length) {
            if (onScreen) {
                if (nextUrl !== null) {
                    const timer = setTimeout(() => {
                        setLoadMore(true);
                        setOffset(prevOffset => prevOffset += limit);
                    }, 1000);
    
                    return () => {
                        clearTimeout(timer);
                    };
                } else {
                    alert('No more data!');
                }
            }
        }
    }, [onScreen]);

    let content = <div></div>;

    if (!error && pokemonData.length > 0) {
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
   
    if (!error && pokemonData.length && pokemonList.length) {
        content = (
            <ul className={classes['list']}>
                {
                    pokemonList.map((item) => {
                        return <PokemonItem key={item.id} item={item}></PokemonItem>
                    })
                }
            </ul>
        );
    }

    if (error) {
        content = <p>{error}</p>;
    }

    return (
        <div className={classes['wrap-pokemon-list']}>
            {content}
            <div ref={loader}></div>
            {loadMore && <LoadingIndicator/>}
        </div>
    )
};

export default PokemonList;
