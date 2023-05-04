import { useEffect, useState } from 'react';
import LoadingIndicator from 'components/UI/LoadingIndicator';
import { capitalizeFirstLetter, formatStatString, getLastStringSegment } from 'helpers/helpers';
import useFetch from 'hooks/useFetch';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import classes from 'scss/PokemonMove.module.scss';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';

const PokemonMove = () => {
	const { pokemonMove } = useParams();
	const [data, setData] = useState(null);

	const { isLoading, error, fetchData: fetchMove } = useFetch();

	useEffect(() => {
		fetchMove(
			{
				url: `https://pokeapi.co/api/v2/move/${pokemonMove}`,
			},
			(data) => {
				if (data) {
					setData(data);
				}
			}
		);
	}, [fetchMove, pokemonMove]);

	let content = isLoading && <div style={{ minHeight: '80vh' }}>{<LoadingIndicator type='fixed' />}</div>;

	if (error) {
		content = <p>{error}</p>;
	}

	if (!isLoading && !error && data) {
		content = (
			<div className={classes['wrap-pokemon-move']}>
				<h1 className='title'>{formatStatString(pokemonMove)} (move)</h1>
				<div className={classes['wrap-move']}>
					<div className={classes.left}>
						<h3 className='heading'>Move data</h3>
						<table className={classes['table-data']}>
							<tbody>
								<tr>
									<td>Type</td>
									<td>
										<Link
											to={`/pokemon/type/${data?.type.name}`}
											className={`color color-${data?.type.name}`}>
											{data?.type.name}
										</Link>
									</td>
								</tr>
								<tr>
									<td>Category</td>
									<td>
										<img
											style={{ width: 30 }}
											src={`/images/move-${data?.damage_class.name}.png`}
											alt={data?.damage_class.name}
										/>{' '}
										&nbsp;
										{capitalizeFirstLetter(data?.damage_class.name)}
									</td>
								</tr>
								<tr>
									<td>Power</td>
									<td>{data?.power}</td>
								</tr>
								<tr>
									<td>Accuracy</td>
									<td>{data?.accuracy}</td>
								</tr>
								<tr>
									<td>PP</td>
									<td>{data?.pp}</td>
								</tr>
								<tr>
									<td>Introduced</td>
									<td>{data?.generation.name}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className={classes.right}>
						<h3 className='heading'>Effects</h3>
						<p>{data ? data.effect_entries[0].short_effect : ''}</p>
					</div>
				</div>
				<div>
					<h3 className='heading'>Learned by Pokemon</h3>
					{data && data.learned_by_pokemon.length > 0 ? (
						<div className={classes.list}>
							{data.learned_by_pokemon.map((item) => (
								<Link to={`/pokemon/${item.name}`} key={item.name} className={classes.item}>
									<LazyLoadImage
										alt={item.name}
										src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getLastStringSegment(
											item.url
										)}.png`}
										onError={({ currentTarget }) => {
											currentTarget.onerror = null; // prevents looping
											currentTarget.src = '/images/notfound.png';
										}}
									/>
								</Link>
							))}
						</div>
					) : null}
				</div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>Pokemon Move</title>
			</Helmet>
			<div className='content'>{content}</div>
		</>
	);
};

export default PokemonMove;
