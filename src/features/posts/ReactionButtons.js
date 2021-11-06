import React from "react";
import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";
import { useAddNewPostMutation, useAddReactionMutation } from "../api/apiSlice";

const reactionEmoji = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀',
}

export function ReactionButtons({ post }) {
    const [addReaction] = useAddReactionMutation();
    // const dispatch = useDispatch();

    const reactionButtons = Object.entries(reactionEmoji).map(([reactionName, emoji]) => {
        return (
            <button
                key={reactionName}
                type="button"
                className="muted-button recation-button"
                onClick={() =>
                    // dispatch(reactionAdded({ postId: post.id, reaction: reactionName }))
                    addReaction({postId: post.id, reaction: reactionName})
                }
            >
                {emoji} {post.reactions[reactionName]}
            </button>
        );
    });

    return (<div>{reactionButtons}</div>);
}