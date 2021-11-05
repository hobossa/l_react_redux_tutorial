import { Link } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";
import { Spinner } from "../../components/Spinner";
import { useGetPostQuery } from "../api/apiSlice";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons";


export function SinglePostPage({ match }) {
    // console.log(arguments);
    const { postId } = match.params;

    const {
        data: post,
        isFetching,
        isSuccess,
    } = useGetPostQuery(postId);

    let content;

    if (isFetching) {
        content = <Spinner text="Loading..." />;
    } else if (isSuccess) {
        content = (
            <article className="post">
                <h2>{post.title}</h2>
                <div>
                    <PostAuthor userId={post.user} />
                    <TimeAgo timestamp={post.date} />
                </div>
                <p className="post-content">{post.content}</p>
                <ReactionButtons post={post} />
                <Link to={`/editPost/${post.id}`} className="button">
                    Edit Post
                </Link>
            </article>
        );
    }

    return (
        <section>
            {content}
        </section>
    );
}