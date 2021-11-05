import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, selectAllPosts, selectPostIds, selectPostById } from "./postsSlice";
import { Link } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons";
import { Spinner } from '../../components/Spinner'


let PostExcerpt = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId));
    return (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>

            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    );
}

// we could wrap the <PostExcerpt> component in React.memo(), 
// which will ensure that the component inside of it only re-renders 
// if the props have actually changed.
// PostExcerpt = React.memo(PostExcerpt);

export function PostsList() {
    const dispatch = useDispatch();

    const orderedPostIds = useSelector(selectPostIds);
    // const posts = useSelector(selectAllPosts);
    const postStatus = useSelector(state => state.posts.status);
    const error = useSelector(state => state.posts.error);

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);

    let content;

    if (postStatus === 'loading') {
        content = <Spinner text="Loading..." />;
    } else if (postStatus === 'succeeded') {
        // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
        // content = orderedPosts.map(post => (<PostExcerpt key={post.id} post={post} />));
        content = orderedPostIds.map( postId => (
            <PostExcerpt key={postId} postId={postId} />
        ));
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}