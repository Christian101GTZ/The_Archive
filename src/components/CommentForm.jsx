function CommentForm({
  commentContent,
  setCommentContent,
  handleCommentSubmit,
  isPostingComment,
}) {
  return (
    <form
      className="comment-form"
      onSubmit={handleCommentSubmit}
    >
      <label htmlFor="comment-content">
        Add to the discussion
      </label>

      <textarea
        id="comment-content"
        value={commentContent}
        onChange={(e) =>
          setCommentContent(e.target.value)
        }
        placeholder="Share information, context, or your thoughts..."
        maxLength={1000}
      />

      <div className="comment-form-footer">
        <span>{commentContent.length}/1000</span>

        <button
          type="submit"
          disabled={isPostingComment}
        >
          {isPostingComment
            ? "Posting..."
            : "Post Comment"}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;