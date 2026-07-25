import CommentCard from "./CommentCard";

function CommentList({
  comments,
  commentsLoading,
  deletingCommentId,
  handleDeleteComment,
  formatCommentDate,
}) {
  if (commentsLoading) {
    return <p>Loading comments...</p>;
  }

  if (comments.length === 0) {
    return (
      <p className="empty-comments">
        No comments yet. Start the discussion.
      </p>
    );
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          deletingCommentId={deletingCommentId}
          handleDeleteComment={handleDeleteComment}
          formatCommentDate={formatCommentDate}
        />
      ))}
    </div>
  );
}

export default CommentList;