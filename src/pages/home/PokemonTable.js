import { Fragment, memo } from 'react';
import PokemonTableItem from '@/components/Table/PokemonTableItem';
import classes from '@/scss/PokemonTable.module.scss';

const PokemonTable = ({ data, sortHandler, onLoadMore, getClassName }) => { 
	return (
		<Fragment>
			<div className={classes['table-container']}>
				<table id='pokedex' className={classes['pokemon-table']}>
					<thead>
						<tr>
							<th
								className={`${classes.sorting} ${getClassName('id')}`}
								onClick={() => sortHandler('id')}>
								#
							</th>
							<th
								className={`${classes.sorting} ${getClassName('name')}`}
								onClick={() => sortHandler('name')}>
								Name
							</th>
							<th>Type</th>
							<th
								className={`${classes.sorting} ${getClassName('total')}`}
								onClick={() => sortHandler('total')}>
								Total
							</th>
							<th
								className={`${classes.sorting} ${getClassName('hp')}`}
								onClick={() => sortHandler('hp')}>
								HP
							</th>
							<th
								className={`${classes.sorting} ${getClassName('attack')}`}
								onClick={() => sortHandler('attack')}>
								Attack
							</th>
							<th
								className={`${classes.sorting} ${getClassName('defense')}`}
								onClick={() => sortHandler('defense')}>
								Defense
							</th>
							<th
								className={`${classes.sorting} ${getClassName('sp-attack')}`}
								onClick={() => sortHandler('sp-attack')}>
								Sp. Atk
							</th>
							<th
								className={`${classes.sorting} ${getClassName('sp-defense')}`}
								onClick={() => sortHandler('sp-defense')}>
								Sp. Def
							</th>
							<th
								className={`${classes.sorting} ${getClassName('speed')}`}
								onClick={() => sortHandler('speed')}>
								Speed
							</th>
						</tr>
					</thead>
					<tbody>
						{data.length > 0 &&
							data.map((item) => (
								<tr key={item.id}>
									<PokemonTableItem
										name={item.name}
										id={item.id}
										types={item.types}
										stats={item.stats}
										image={item.image}
									/>
								</tr>
							))}
					</tbody>
				</table>
				{data.length <= 0 && <p style={{ marginLeft: 30 }}>No result found. Please try again.</p>}
			</div>
			{/* <button className={classes.button} onClick={onLoadMore}>
				Load more
			</button> */}
		</Fragment>
	);
};

export default memo(PokemonTable);
