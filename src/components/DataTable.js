import { memo } from 'react';
import classes from './DataTable.module.scss';

const DataTable = ({ headCells, data, onSort, className }) => {
	return (
		<div className={classes['table-container']}>
			<table className={classes['data-table']}>
				<thead>
					<tr>
						{headCells.map((item) => (
							<th
								key={item.name}
								className={`${classes.sorting} ${className && className(item.name)}`}
								style={{width: item.width ? item.width : 'auto'}}
								onClick={() => {
									onSort && onSort(item.name);
								}}
								align={item.align ? item.align : 'left'}>
								{item.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.length > 0 ? (
						data.map((item) => (
							<tr key={item.id}>
								{headCells.map((val) => (
									<td key={val.name} className={val.className ? classes[val.className] : ""}>
										{
											val.display ? val.display(item[val.name]) : item[val.name]
										}
									</td>
								))}
							</tr>
						))
					) : (
						<tr>
							<td colSpan={headCells.length}>No data available</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default memo(DataTable);
