import CommentCard from "./CommentCard";

function CommentList({
  comments,
  commentsLoading,
  deletingCommentId,
  handleDeleteComment,
  formatCommentDate,
}) {
  if (commentsLoading) {
    return <p>Loading discussion...</p>;
  }

  if (comments.length === 0) {
    return (
      <p className="empty-comments">
        No replies yet. Be the first to join the discussion.
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