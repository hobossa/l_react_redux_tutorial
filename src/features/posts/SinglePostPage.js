import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import { Link } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";


export function SinglePostPage({match}) {
    // console.log(arguments);
    const {postId} = match.params;

    const post = useSelector(state => selectPostById(state, postId));

    if (!post) {
        return (
            <section>
                <h2>Post not found</h2>
            </section>
        );
    }

    return (
        <section>
            <h2>{post.title}</h2>
            <PostAuthor userId={post.user} />
            <p className="post-content">{post.content}</p>
            <Link to={`/editPost/${post.id}`} className="button">
                Edit Post
            </Link>
        </section>
    );
}