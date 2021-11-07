import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState:  {
        isLoading: false,
        error: null
    },
    reducers: {
        showStatus(state, action) {
            state.isLoading =  action.payload.isLoading;
            state.error =  action.payload.error;
        }
    }
});

export const uiActions = uiSlice.actions;

export default uiSlice;