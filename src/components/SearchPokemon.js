import classes from '../scss/SearchPokemon.module.scss';
import iconSearch from '../assets/images/icon-search.svg';
import { useState, useEffect, useRef } from 'react';
import { capitalizeFirstLetter, getLinkSuggestion } from '../helpers/helpers';

// function debounce (fn, delay) {
//     return args => {
//         clearTimeout(fn.id)

//         fn.id = setTimeout(() => {
//             fn.call(this, args)
//         }, delay)
//     }
// }

const SearchPokemon = (props) => {
    const [pokemonSearchData, setPokemonSearchData] = useState(null);
    const [searchKey, setSearchKey] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [showList, setShowList] = useState(false);

    const listRef = useRef();

    const handleClickOutside = e => {
        if (listRef && listRef.current) {
            const ref = listRef.current;
                
            if(!ref.contains(e.target)){
                setShowList(false);
            }
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (pokemonSearchData) {
                const results = pokemonSearchData.filter(name => name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1);
                const suggestions = results.slice(0, 5);

                setSearchList(data => results.length ? results : []);
                setSuggestions(data => suggestions);
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, [searchKey, pokemonSearchData]);

    const getPokemonSearchData = async () => {
        setShowList(true);
        if (!pokemonSearchData) {
            const response = await fetch('https://learn-react-2816d-default-rtdb.firebaseio.com/pokemonSearchData.json');
            const data = await response.json();
            setPokemonSearchData(data.pokedex);
        }
    }

    const searchPokemonHandler = (e) => {
        setSearchKey(e.target.value);
    }

    const submitSearch = (e) => {
        e.preventDefault();
        setShowList(false);
        if (searchKey) {
            props.searchHandler(searchList);
        } else {
            props.searchHandler(null);
        }
    }

    return (
        <div className={classes['wrap-pokemon-search']}>
            <form className={classes['search-form']} onSubmit={submitSearch}>
                <div className={classes['wrap-input']} ref={listRef}>
                    <input type="text" placeholder="Search for a Pokémon" value={searchKey}
                        onMouseDown={getPokemonSearchData}
                        onChange={searchPokemonHandler}
                    />
                    {
                        suggestions && (
                            <ul className={classes.suggestions} style={{display: searchKey && suggestions.length > 0 && showList ? 'block' : 'none'}}>
                                {
                                    suggestions.length > 0 && suggestions.map(name => (
                                        <li key={name}><a href={`/pokemon/${getLinkSuggestion(name)}`}>{capitalizeFirstLetter(name)}</a></li>
                                    ))
                                }
                            </ul>
                        )
                    }
                </div>
                <button><img src={iconSearch} alt="search" /></button>
            </form>
        </div>
    );
};


export default SearchPokemon;