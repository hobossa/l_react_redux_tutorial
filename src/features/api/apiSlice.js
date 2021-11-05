import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our single API slice object
export const apiSlice = createApi({
    // The cache reducer expects to be added at 'state.api' (already default - this is optional)
    reducerPath: 'api',
    // All of our requests will have URLs starting with '/fakeApi'
    baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
    tagTypes: ['Post'],
    // The "endpoints" represent operations and requests for this server
    endpoints: (builder) => ({
        // The 'getPosts' endpoint is a "query" operation that returns data
        getPosts: builder.query({
            // The URL for the request is '/fakeApi/posts'
            query: () => '/posts',
            providesTags: (result = [], error, arg) => [
                'Post',
                ...result.map(({ id }) => ({ type: 'Post', id }))
            ]
        }),
        getPost: builder.query({
            query: (postId) => `/posts/${postId}`,
            providesTags: (result, error, arg) => [{ type: 'Post', id: arg }]
        }),
        addNewPost: builder.mutation({
            query: (initialPost) => ({
                url: '/posts',
                method: 'POST',
                // Include the entire post object as the body of the request
                body: initialPost,
            }),
            invalidatesTags: ['Post'],
        }),
        editPost: builder.mutation({
            query: (post) => ({
                url: `/posts/${post.id}`,
                method: 'PATCH',
                body: post,
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
        }),
        getUsers: builder.query({
            query: () => '/users',
        }),
    }),
});

// Normally you should stick with using the hooks, but here we're 
        // going to work with the user data using just the RTK Query core 
        // API so you can see how to use it.

// Export the auto-generated hook for the 'getPost' query endpoint
export const {
    useGetPostsQuery,
    useGetPostQuery,
    useAddNewPostMutation,
    useEditPostMutation,
    useGetUsersQuery,
} = apiSlice;