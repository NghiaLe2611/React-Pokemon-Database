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
                nextUrl: action.payload.nextUrl
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
                        sortType: 'asc'
                    }
                } else if (state.sortType === 'asc') {
                    return {
                        ...state,
                        sortType: 'desc'
                    }
                } else if (state.sortType === 'desc') {
                    return {
                        ...state,
                        sortName: 'id',
                        sortType: ''
                    }
                }  
            } else {
                return {
                    ...state,
                    sortName: action.name,
                    sortType: 'asc'
                }
            }

            return {
                ...state
            }
		default:
			throw new Error();
	}
};