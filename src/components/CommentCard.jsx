/**
 * CommentCard.jsx — One comment
 *
 * Shows a single comment: its text, when it was posted, and a Delete button
 * that only appears for the comment's own author.
 */
function CommentCard({
  comment,
  deletingCommentId,
  handleDeleteComment,
  formatCommentDate,
  currentUserId,
}) {
  // Only the person who wrote the comment should see a Delete button. (The
  // actual delete is also guarded on the server, but hiding it here keeps the
  // UI honest so other users aren't shown an action they can't perform.)
  const isOwner = Boolean(currentUserId) && comment.user_id === currentUserId;

  return (
    <article className="comment-card">
      <p>{comment.content}</p>

      <div className="comment-footer">
        <time dateTime={comment.created_at}>
          {formatCommentDate(comment.created_at)}
        </time>

        {isOwner && (
          <button
            type="button"
            onClick={() => handleDeleteComment(comment.id)}
            disabled={deletingCommentId === comment.id}
          >
            {deletingCommentId === comment.id
              ? "Removing..."
              : "Delete Comment"}
          </button>
        )}
      </div>
    </article>
  );
}

export default CommentCard;