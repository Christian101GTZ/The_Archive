function CommentCard({
  comment,
  deletingCommentId,
  handleDeleteComment,
  formatCommentDate,
}) {
  return (
    <article className="comment-card">
      <p>{comment.content}</p>

      <div className="comment-footer">
        <time dateTime={comment.created_at}>
          {formatCommentDate(comment.created_at)}
        </time>

        <button
          type="button"
          onClick={() => handleDeleteComment(comment.id)}
          disabled={deletingCommentId === comment.id}
        >
          {deletingCommentId === comment.id
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default CommentCard;