import {
  AddCommentItem,
  DeleteCommentItem,
  EditCommentItem,
  NewCommentItem,
  UpdateCommentScore,
  UserVote,
} from "../types";

const newItem: NewCommentItem = (user, content, replyingTo = "") => {
  return {
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    content: content.replace(`@${replyingTo}`, ""),
    createdAt: Date.now(),
    score: 0,
    user: {
      image: {
        png: user.image.png,
        webp: user.image.webp,
      },
      username: user.username,
    },
    replyingTo,
    replies: [],
    userVotes: [],
  };
};

const addItem: AddCommentItem = (comments, parentId, newComment) => {
  const updatedComments = comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: comment.replies
          ? [...comment.replies, newComment]
          : [newComment],
      };
    } else if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = addItem(comment.replies, parentId, newComment);
      return {
        ...comment,
        replies: updatedReplies,
      };
    }
    return comment;
  });

  return updatedComments;
};

const editItem: EditCommentItem = (comments, id, content) => {
  const updatedComments = comments.map((comment) => {
    if (comment.id === id) {
      return {
        ...comment,
        content,
      };
    } else if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = editItem(comment.replies, id, content);
      return {
        ...comment,
        replies: updatedReplies,
      };
    }
    return comment;
  });

  return updatedComments;
};

const deleteItem: DeleteCommentItem = (comments, commentId) => {
  return comments.filter((comment) => {
    if (comment.id === commentId) {
      return false; // Exclude the comment with the matching ID
    }

    if (comment.replies && comment.replies.length > 0) {
      comment.replies = deleteItem(comment.replies, commentId); // Recursively process replies
    }

    return true; // Include all other comments
  });
};

const updateItemScore: UpdateCommentScore = (
  comments,
  id,
  score,
  action,
  currentUserName
) => {
  const updatedComments = comments.map((comment) => {
    const filteredUserVotes = comment.userVotes
      ? [
          ...comment.userVotes.filter(
            ({ username }) => username !== currentUserName
          ),
        ]
      : [];
    const updatedNewUserVotes: UserVote[] = [
      ...filteredUserVotes,
      { username: currentUserName, action },
    ];
    if (comment.id === id) {
      // If the comment id matches, update the score
      return {
        ...comment,
        score,
        userVotes: updatedNewUserVotes,
      };
    } else if (comment.replies && comment.replies.length > 0) {
      // If there are replies, recursively update them
      const updatedReplies = comment.replies.map((reply) => {
        if (reply.id === id) {
          return {
            ...reply,
            score,
            userVotes: updatedNewUserVotes,
          };
        }
        return reply;
      });
      return { ...comment, replies: updatedReplies };
    }

    return comment;
  });

  return updatedComments;
};

export default {
  newItem,
  addItem,
  editItem,
  deleteItem,
  updateItemScore,
};
