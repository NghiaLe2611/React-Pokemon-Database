import { useState, useEffect, Fragment } from 'react';
import classes from '../scss/PokemonTable.module.scss';
import PokemonTableItem from './PokemonTableItem';
import LoadingIndicator from './UI/LoadingIndicator';

const PokemonTableList = () => {
    const pokemonDataStorage = JSON.parse(localStorage.getItem('pokemonTableData')) || [];

    const [nextUrl, setNextUrl] = useState(() => {
        const savedNextUrl = localStorage.getItem('nextUrl');
        return savedNextUrl || 'https://pokeapi.co/api/v2/pokemon?limit=10';
    });
    const [pokemonList, setPokemonList] = useState(() => {
        return pokemonDataStorage || [];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

	const getAllPokemons = async (url) => {

        try {
            setIsLoading(true);
            const res = await fetch(url);
            const data = await res.json();

            setNextUrl(data.next);

            async function createPokemonObject(results) {
                for (const pokemon of results) {
                    const res = await fetch(
                        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
                    );
                    const data = await res.json();
                    const pokemonInfo = {
                        id: data.id,
                        name: data.name,
                        stats: data.stats,
                        types: data.types,
                        image: data.sprites.front_default
                    }
                    setPokemonList(currentList => [...currentList, pokemonInfo]);
                }
            }

            createPokemonObject(data.results);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
        }
	};

	useEffect(() => {
        if (pokemonDataStorage.length <= 0) {
            console.log('Get all pokemons');
            getAllPokemons(nextUrl);
        } 
	}, []);

    useEffect(() => {
        localStorage.setItem('pokemonTableData', JSON.stringify(pokemonList));
    }, [pokemonList]);

    useEffect(() => {
        localStorage.setItem('nextUrl', nextUrl);
    }, [nextUrl]);

    const loadMoreHandler = () => {
        getAllPokemons(nextUrl);
    }


	return (
		<Fragment>
            {isLoading && !error && <LoadingIndicator/>}
            {error && <p style={{backgroundColor: 'white', padding: 10}}>{error}</p>}
			<table id='pokedex' className={classes['pokemon-table']}>
				<thead>
					<tr>
						<th className={classes.sorting}>#</th>
						<th className={classes.sorting}>Name</th>
						<th>Type</th>
						<th className={classes.sorting}>Total</th>
						<th className={classes.sorting}>HP</th>
						<th className={classes.sorting}>Attack</th>
						<th className={classes.sorting}>Defense</th>
						<th className={classes.sorting}>Sp. Atk</th>
						<th className={classes.sorting}>Sp. Def</th>
						<th className={classes.sorting}>Speed</th>
					</tr>
				</thead>
				<tbody>
                    {
                        pokemonList.length > 0 && (
                            pokemonList.map((item) => (
                                <tr key={item.id}>
                                    <PokemonTableItem
                                        name={item.name}
                                        id={item.id}
                                        types={item.types}
                                        stats={item.stats}
                                        image={item.image}
                                    />
                                </tr>
                            ))
                        ) 
                    }
				</tbody>
			</table>
            <button className={classes.button} onClick={loadMoreHandler}>Load more</button>
		</Fragment>
	);
};

export default PokemonTableList;