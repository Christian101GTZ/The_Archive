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
        Join the discussion
      </label>

      <textarea
        id="comment-content"
        value={commentContent}
        onChange={(e) =>
          setCommentContent(e.target.value)
        }
        placeholder="Share your thoughts, additional details, or helpful context..."
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
            : "Post Reply"}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;