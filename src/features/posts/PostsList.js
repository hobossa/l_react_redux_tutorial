import React, {useMemo} from "react";
import { Link } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons";
import { Spinner } from '../../components/Spinner';
import { useGetPostsQuery } from '../api/apiSlice';
import classnames from 'classnames';


let PostExcerpt = ({ post }) => {
    // console.log(post);
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
    const {
        data: posts = [],
        isLoading,
        isSuccess,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetPostsQuery();

    const sortedPosts = useMemo(() => {
        const sortedPosts = posts.slice()
        sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
        return sortedPosts
    }, [posts])

    let content;

    if (isLoading) {
        content = <Spinner text="Loading..." />;
    } else if (isSuccess) {
        // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
        // content = orderedPosts.map(post => (<PostExcerpt key={post.id} post={post} />));

        // content = posts.map(post => (
        //     <PostExcerpt key={post.id} post={post} />
        // ));

        const renderedPosts = sortedPosts.map(post => (
            <PostExcerpt key={post.id} post={post} />
        ))

        const containerClassname = classnames('posts-container', {
            disabled: isFetching
        })

        content = <div className={containerClassname}>{renderedPosts}</div>
    } else if (isError) {
        content = <div>{error.toString()}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            <button onClick={refetch}>Refetch Posts</button>
            {content}
        </section>
    )
}