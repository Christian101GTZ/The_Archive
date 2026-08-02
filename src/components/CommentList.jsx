/**
 * CommentList.jsx — The list of comments
 *
 * Shows one CommentCard per comment. Handles the two special cases too: a
 * "loading" message while comments are being fetched, and an "empty" message
 * when there are none yet.
 */
import CommentCard from "./CommentCard";

function CommentList({
  comments,
  commentsLoading,
  deletingCommentId,
  handleDeleteComment,
  formatCommentDate,
  currentUserId,
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
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

export default CommentList;