import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";


const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = notificationsAdapter.getInitialState();

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {
        const allNotifications = selectAllNotifications(getState());
        const [latestNotification] = allNotifications;
        const latestTimestamp = latestNotification ? latestNotification.date : '';
        const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`);
        return response.data;
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        allNotificationsRead: (state, action) => {
            Object.values(state.entities).forEach(notification => {
                notification.read = true;
            });
        }
    },
    extraReducers: {
        [fetchNotifications.fulfilled]: (state, action) => {
            // state.push(...action.payload);
            // state.forEach(notification => {
            //     notification.isNew = !notification.read;
            // });
            // state.sort((a, b) => b.date.localeCompare(a.date));
            Object.values(state.entities).forEach(notification => {
                notification.isNew = !notification.read;
            })
            notificationsAdapter.upsertMany(state, action.payload);
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchNotifications.fulfilled, (state, action) => {
    //             state.push(...action.payload);
    //             state.forEach(notification => {
    //                 notification.isNew = !notification.read;
    //             });
    //             state.sort((a, b) => b.date.localeCompare(a.date));
    //         });
    // },
});


export const { allNotificationsRead } = notificationsSlice.actions;

//export const selectAllNotifications = (state) => state.notifications;
export const { selectAll: selectAllNotifications } =
    notificationsAdapter.getSelectors(state => state.notifications);

export default notificationsSlice.reducer;