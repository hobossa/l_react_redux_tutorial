import {
    createAction,
    createSlice,
    createEntityAdapter,
    createSelector,
    isAnyOf
} from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { forceGenerateNotifications } from '../../api/server'
import { apiSlice } from '../api/apiSlice'

const notificationsReceived = createAction(
    'notifications/notificationsReceived'
)

export const extendedApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotifications: builder.query({
            query: () => '/notifications',
            onCacheEntryAdded: async (arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) => {
                // create a websocket connection when the cache subscription starts
                const ws = new WebSocket('ws://localhost')
                try {
                    // wait for the initial query to resolve before proceeding
                    await cacheDataLoaded

                    // when data is received from the socket connection to the server,
                    // update our query result with the received message
                    const listener = event => {
                        const message = JSON.parse(event.data)
                        switch (message.type) {
                            case 'notifications': {
                                updateCachedData(draft => {
                                    // Insert all received notifications from the websocket
                                    // into the existing RTKQ cache array
                                    draft.push(...message.payload)
                                    draft.sort((a, b) => b.date.localeCompare(a.date))
                                })
                                // Dispatch an additional action so we can track "read" state
                                dispatch(notificationsReceived(message.payload))
                                break
                            }
                            default:
                                break
                        }
                    }

                    ws.addEventListener('message', listener)
                } catch {
                    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                    // in which case `cacheDataLoaded` will throw
                }
                // cacheEntryRemoved will resolve when the cache subscription is no longer active
                await cacheEntryRemoved
                // perform cleanup steps once the `cacheEntryRemoved` promise resolves
                ws.close()
            }
        })
    })
})

// const notificationsAdapter = createEntityAdapter({
//     sortComparer: (a, b) => b.date.localeCompare(a.date),
// });

// const initialState = notificationsAdapter.getInitialState();

// export const fetchNotifications = createAsyncThunk(
//     'notifications/fetchNotifications',
//     async (_, { getState }) => {
//         const allNotifications = selectAllNotifications(getState());
//         const [latestNotification] = allNotifications;
//         const latestTimestamp = latestNotification ? latestNotification.date : '';
//         const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`);
//         return response.data;
//     }
// );

export const { useGetNotificationsQuery } = extendedApi

const notificationsAdapter = createEntityAdapter()

const matchNotificationsReceived = isAnyOf(
    notificationsReceived,
    extendedApi.endpoints.getNotifications.matchFulfilled
)

const emptyNotifications = []

export const selectNotificationsResult =
    extendedApi.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
    selectNotificationsResult,
    notificationsResult => notificationsResult.data ?? emptyNotifications
)

export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
    const allNotifications = selectNotificationsData(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification?.date ?? ''
    // Hardcode a call to the mock server to simulate a server push scenario over websockets
    forceGenerateNotifications(latestTimestamp)
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead: (state, action) => {
            Object.values(state.entities).forEach(notification => {
                notification.read = true;
            });
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(matchNotificationsReceived, (state, action) => {
            // state.push(...action.payload);
            // state.forEach(notification => {
            //     notification.isNew = !notification.read;
            // });
            // state.sort((a, b) => b.date.localeCompare(a.date));

            // Add client-side metadata for tracking new notifications
            const notificationsMetadata = action.payload.map(notification => ({
                id: notification.id,
                read: false,
                isNew: true
            }))
            Object.values(state.entities).forEach(notification => {
                notification.isNew = !notification.read;
            })
            notificationsAdapter.upsertMany(state, action.payload);
        })
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
export const {
    selectAll: selectNotificationsMetadata,
    selectEntities: selectMetadataEntities
} =
    notificationsAdapter.getSelectors(state => state.notifications);

export default notificationsSlice.reducer;