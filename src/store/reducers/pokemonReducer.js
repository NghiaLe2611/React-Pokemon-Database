export const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=30';
export const initialState = {
	data: JSON.parse(localStorage.getItem('pokemonList')) || [],
	total: 0,
	isLoading: false,
	error: null,
	nextUrl: localStorage.getItem('nextUrl') || apiUrl,
	sortName: 'id',
	sortType: 'asc',
	hasMore: false,
	filterType: '',
	isFiltering: false,
	searchKey: '',
	view: 'LIST',
};

export const pokemonReducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_INIT':
			return {
				...state,
				isLoading: true,
				error: null,
			};
		case 'FETCH_SUCCESS':
			return {
				...state,
				isLoading: false,
				error: null,
				data: state.data.concat(action.payload.list),
				total: action.payload.count,
				nextUrl: action.payload.nextUrl,
				hasMore: action.payload.hasMore,
			};
		case 'FETCH_FAILURE':
			return {
				...state,
				isLoading: false,
				error: action.error,
			};
		case 'SORT_DATA':
			if (action.name === state.sortName) {
				if (state.sortType === '') {
					return {
						...state,
						sortType: 'asc',
					};
				} else if (state.sortType === 'asc') {
					return {
						...state,
						sortType: 'desc',
					};
				} else if (state.sortType === 'desc') {
					return {
						...state,
						sortName: 'id',
						sortType: '',
					};
				}
			} else {
				return {
					...state,
					sortName: action.name,
					sortType: 'asc',
				};
			}

			return {
				...state,
			};
		case 'FILTERING_DATA':
			return {
				...state,
				isFiltering: action.isFiltering,
			};
		case 'FILTER_DATA':
			return {
				...state,
				filterType: action.filterType,
			};
		case 'SET_VIEW_DATA':
			return {
				...state,
				view: action.view,
			};
		default:
			throw new Error();
	}
};
