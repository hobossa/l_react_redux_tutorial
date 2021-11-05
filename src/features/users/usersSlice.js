import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { apiSlice } from "../api/apiSlice";


// const usersAdapter = createEntityAdapter();

// const initialState = usersAdapter.getInitialState();

// Normally you should stick with using the hooks, but here we're 
// going to work with the user data using just the RTK Query core 
// API so you can see how to use it.

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectUsersResult = apiSlice.endpoints.getUsers.select()

const emptyUsers = []

export const selectAllUsers = createSelector(
    selectUsersResult,
    usersResult => usersResult?.data ?? emptyUsers
)

export const selectUserById = createSelector(
    [selectAllUsers,
    (state, userId) => userId],
    (users, userId) => users.find(user => user.id === userId)
)

// export const fetchUsers = createAsyncThunk(
//     'user/fetchUsers',
//     async () => {
//         const response = await client.get('/fakeApi/users');
//         return response.data;
//     }
// );

const userSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        //builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll);
    },
});


// export const selectAllUsers = (state) => state.users;
// export const selectUserById = (state, userId) => state.users.find(user => user.id === userId);
// export const {
//     selectAll: selectAllUsers,
//     selectById: selectUserById,
// } = usersAdapter.getSelectors(state => state.users);

export default userSlice.reducer;