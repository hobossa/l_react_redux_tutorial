import React, { useState } from "react";
import { useAddNewPostMutation } from "../api/apiSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useSelector } from "react-redux";

export function AddPostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');

    const [addNewPost, { isLoading }] = useAddNewPostMutation();

    const users = useSelector(selectAllUsers);

    const onTitleChanged = (e) => setTitle(e.target.value);
    const onContentChanged = (e) => setContent(e.target.value);
    const onAuthorChanged = (e) => setUserId(e.target.value);

    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await addNewPost({ title, content, user: userId }).unwrap();
                setTitle('')
                setContent('')
                setUserId('')
            } catch (err) {
                console.error('Failed to save the post: ', err)
            }
        }
        // if (canSave) {
        //     // However, it's common to want to write logic that looks at the success or 
        //     // failure of the actual request that was made. Redux Toolkit adds a .unwrap() 
        //     // function to the returned Promise, which will return a new Promise that 
        //     // either has the actual action.payload value from a fulfilled action, 
        //     // or throws an error if it's the rejected action. This lets us handle success 
        //     // and failure in the component using normal try/catch logic. So, we'll clear 
        //     // out the input fields to reset the form if the post was successfully created, 
        //     // and log the error to the console if it failed.

        //     // Thunks can return promises. For createAsyncThunk specifically, 
        //     // you can await dispatch(someThunk()).unwrap() to handle the request
        //     // success or failure at the component level.
        //     try {
        //         setAddRequestStatus('pending');
        //         await dispatch(addNewPost({title, content, user: userId})).unwrap();
        //         setTitle('');
        //         setContent('');
        //         setUserId('')
        //     } catch (err) {
        //         console.error('Failed to save the post: ', err);
        //     } finally {
        //         setAddRequestStatus('idel');
        //     }
        // }
    }

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ));

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    placeholder="What's on your mind?"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
            </form>
        </section>
    );
}