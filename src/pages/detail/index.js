import { useState, useEffect, Fragment, useCallback, useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import LoadingIndicator from 'components/UI/LoadingIndicator';
import { capitalizeFirstLetter, convertPokemonInfo, formatStatString, convertPokemonId } from 'helpers/helpers';
import styled, { keyframes, css } from 'styled-components';
import useFetch from 'hooks/useFetch';
import NotFound from 'pages/NotFound';
import classes from 'scss/PokemonDetail.module.scss';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import DataTable from 'components/DataTable';
import PokemonTypes from 'components/PokemonTypes';
import PokemonMoves from './PokemonMoves';

const BASE_MAX_STAT = 180;

const movesHeadcells = [
	{
		name: 'level_learned_at',
		label: 'Lv.',
	},
	{
		name: 'name',
		label: 'Move',
		display: (value) => {
			return <Link to={`/move/${value}`}>{formatStatString(value)}</Link>;
		},
		className: 'link',
		width: 200,
	},
	{
		name: 'type',
		label: 'Type',
		display: (value) => {
			return (
				<Link to={`/pokemon/type/${value}`} className={`color-${value}`}>
					{value}
				</Link>
			);
		},
		className: 'type',
	},
	{
		name: 'cate',
		label: 'Cat.',
		display: (value) => {
			return <img style={{ width: 30 }} src={`/images/move-${value}.png`} alt={value} title={value} />;
		},
	},
	{
		name: 'power',
		label: 'Power',
		display: (value) => {
			return <>{value ? value : '—'}</>;
		},
	},
	{
		name: 'accuracy',
		label: 'Accuracy',
		display: (value) => {
			return <>{value ? value : '—'}</>;
		},
	},
];

// Animation Progress Bar using styled-components
const progressAnimation = keyframes`
    from { width: 0; }
    to { width: ${(props) => `${(props.value / BASE_MAX_STAT) * 100}%`} }
`;

const ProgressBar = styled.div`
	width: ${(props) => `${(props.value / BASE_MAX_STAT) * 100}%`};
	animation: ${css`
		${progressAnimation} 1s ease
	`};
	background-color: ${(props) => {
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
	const { state } = useLocation();

	const [pokemonDetail, setPokemonDetail] = useState(null);
	const [evolutionChain, setEvolutionChain] = useState(null);
	const [types, setTypes] = useState(null);
	const [stats, setStats] = useState(null);
	const [imageSrc, setImageSrc] = useState('');

	const { isLoading, error, fetchData: fetchPokemon } = useFetch();

	// Get pokemon detail
	useEffect(() => {
		console.log('Fetch pokemon');
		fetchPokemon(
			{
				url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
			},
			(data) => {
				if (data) {
					setPokemonDetail(data);

					let arrayStats = [];

					data.stats.forEach((item) => {
						arrayStats.push({
							name: item.stat.name,
							stat: item.base_stat,
						});
					});

					setTypes(data.types.map((item) => item.type.name));
					setStats(arrayStats);
				}
			}
		);
	}, [fetchPokemon, pokemonId]);

	// Get species & evolution chain
	useEffect(() => {
		// `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
		const fetchSpecies = async () => {
			try {
				const response = await axios.get(pokemonDetail.species.url);

				return response.data;
			} catch (error) {
				console.error(error);
			}
		};

		const fetchEvolutionChain = async (evolutionChainUrl) => {
			try {
				const response = await axios.get(evolutionChainUrl);

				return response.data;
			} catch (error) {
				console.error(error);
			}
		};

		const fetchMoves = async () => {};

		if (pokemonDetail) {
			fetchSpecies().then(function (species) {
				if (species['evolution_chain'].url) {
					fetchEvolutionChain(species['evolution_chain'].url).then((evolutionChain) => {
						let evoChain = [];
						var evoData = evolutionChain.chain;
						do {
							const evoDetails = evoData['evolution_details'][0];

							evoChain.push({
								name: evoData.species.name,
								min_level: !evoDetails ? 1 : evoDetails.min_level,
								// 'trigger_name': !evoDetails ? null : evoDetails.trigger.name,
								// 'item': !evoDetails ? null : evoDetails.item
							});

							evoData = evoData['evolves_to'][0];
						} while (!!evoData && evoData.hasOwnProperty('evolves_to')); // Convert object to boolean (return true/false)

						setEvolutionChain(evoChain);
					});
				}
			});

			
		}
	}, [pokemonDetail]);

	useEffect(() => {
		if (pokemonDetail) {
			setImageSrc(`https://img.pokemondb.net/artwork/${pokemonDetail.name}.jpg`);
		}
	}, [pokemonDetail]);

	const handleImageError = () => {
		setImageSrc(pokemonDetail.sprites.other.home['front_default']);
	};

	let content = <div style={{ minHeight: '80vh' }}>{<LoadingIndicator type='fixed' />}</div>;

	if (!isLoading && !error && pokemonDetail) {
		content = (
			<Fragment>
				<h1 className={classes.title}>{capitalizeFirstLetter(pokemonDetail.species.name)}</h1>
				<div className={classes['img']}>
					<img src={imageSrc} alt={pokemonDetail.name} onError={handleImageError} />
				</div>
				<div className={classes['wrap-pokemon-info']}>
					<h3 className={classes.heading}>Pokédex data</h3>
					<table className={classes['table-data']}>
						<tbody>
							<tr>
								<td>National №</td>
								<td>
									<strong>
										{state && state.id
											? convertPokemonId(state.id)
											: convertPokemonId(pokemonDetail.id)}
									</strong>
								</td>
							</tr>
							<tr>
								<td>Type</td>
								<td>
									<PokemonTypes types={types} />
								</td>
							</tr>
							<tr>
								<td>Height</td>
								<td>
									{pokemonDetail.height / 10}m ({convertPokemonInfo('H', pokemonDetail.height)})
								</td>
							</tr>
							<tr>
								<td>Weight</td>
								<td>
									{pokemonDetail.weight / 10}kg ({convertPokemonInfo('W', pokemonDetail.weight)} lbs)
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className={classes['wrap-pokemon-stats']}>
					<h3 className={classes.heading}>Base stats</h3>
					<table className={classes['table-stat']}>
						<tbody>
							{stats &&
								stats.map((item) => (
									<tr key={item.name}>
										<td>{formatStatString(item.name)}</td>
										<td>{item.stat}</td>
										<td className={classes['stat-bar']}>
											<ProgressBar value={item.stat} />
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
				<div className={classes['wrap-pokemon-moves']}>
					<h3 className={classes.heading}>Moves learned by {capitalizeFirstLetter(pokemonDetail.name)}</h3>
					<div className={classes.moves}>
						<h4 className={classes.h4}>Moves learnt by level up</h4>
						<PokemonMoves type='level-up' data={pokemonDetail.moves} />
					</div>

					<div className={classes.moves}>
						<h4 className={classes.h4}>Moves learnt by TM</h4>
						<PokemonMoves type='machine' data={pokemonDetail.moves} />
					</div>
				</div>
				<div className={classes['wrap-evolution-chain']}>
					<h3 className={classes.heading}>Evolution Chain</h3>
					{evolutionChain ? (
						<div className={classes['list-evolution']}>
							{evolutionChain.map((item) => (
								<div key={item.name} className={classes['evo-item']}>
									<a href={`/pokemon/${item.name}`} className={classes.img}>
										<img
											src={`https://img.pokemondb.net/artwork/${item.name}.jpg`}
											alt={item.name}
										/>
									</a>
									<h4 className={classes.name}>{capitalizeFirstLetter(item.name)}</h4>
								</div>
							))}
						</div>
					) : (
						<p>{capitalizeFirstLetter(pokemonDetail.species.name)} does not evolve.</p>
					)}
				</div>
			</Fragment>
		);
	}

	return !error ? (
		<>
			<Helmet>
				<title>
					{pokemonDetail
						? `${capitalizeFirstLetter(pokemonDetail.name)} | Pokémon Database`
						: 'Pokemon Detail'}
				</title>
			</Helmet>
			<div className={`${classes['wrap-pokemon-detail']} content`}>{content}</div>
		</>
	) : (
		<NotFound>
			<p>
				<a href='/pokedex' className={classes.home}>
					Go to homepage
				</a>
			</p>
		</NotFound>
	);
};

export default PokemonDetail;
