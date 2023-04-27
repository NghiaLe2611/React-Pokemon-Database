import axios from 'axios';
import DataTable from 'components/DataTable';
import { capitalizeFirstLetter, formatStatString } from 'helpers/helpers';
import { memo, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const movesHeadcells = [
	{
		name: 'level_learned_at',
		label: 'Lv.',
		display: (value) => {
			return <>{value !== 0 ? value : '—'}</>;
		},
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
			return <img style={{ width: 30 }} src={`/images/move-${value}.png`} alt={value} title={capitalizeFirstLetter(value)} />;
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

function getLevelLearnt(list, name) {
	const item = list.find((item) => item.name === name);
	return item.level_learned_at;
}

const PokemonMoves = ({ data, type }) => {
	const [moves, setMoves] = useState([]);

	const allMoves = useMemo(() => {
		return [...moves].sort((a, b) => {
			return a.level_learned_at - b.level_learned_at;
		});
	}, [moves]);

	useEffect(() => {
		if (data.length) {
			let listMove = data
				.filter((item) =>
					item.version_group_details.some((detail) => detail.move_learn_method.name === 'level-up')
				)
				.map((move) => ({
					name: move.move.name,
					level_learned_at: move.version_group_details.find(
						(detail) => detail.move_learn_method.name === 'level-up'
					).level_learned_at,
					url: move.move.url,
				}));

			if (type !== 'level-up') {
				listMove = data
					.filter((item) =>
						item.version_group_details.some((detail) => detail.move_learn_method.name !== 'level-up')
					)
					.map((move) => ({
						name: move.move.name,
						level_learned_at: move.version_group_details.find(
							(detail) => detail.move_learn_method.name !== 'level-up'
						).level_learned_at,
						url: move.move.url,
					}));
			}

			console.log(listMove);

			const listUrl = listMove.map((move) => move.url);
			listUrl.forEach(async (url) => {
				const res = await axios.get(url);
				const { data } = res;
				const move = {
					id: data.id,
					name: data.name,
					cate: data.damage_class.name,
					accuracy: data.accuracy,
					power: data.power,
					type: data.type.name,
					level_learned_at: getLevelLearnt(listMove, data.name),
				};
				setMoves((prevMoves) => [...prevMoves, move]);
			});
		}
	}, [data, type]);

	return <DataTable headCells={movesHeadcells} data={allMoves} />;
};

export default memo(PokemonMoves);
