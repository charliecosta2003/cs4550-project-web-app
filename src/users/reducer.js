import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    loggedIn: false,
};

const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        }
    }
});

export const {setCurrentUser, setLoggedIn} = slice.actions;
export default slice.reducer;