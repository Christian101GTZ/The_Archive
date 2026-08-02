/**
 * ArtifactDetailsActions.jsx — Buttons on the post page
 *
 * The action row under a post: the up/down vote buttons and the score, plus
 * Edit and Delete buttons that only show for the post's owner.
 */
import { Link } from "react-router-dom";

function ArtifactDetailsActions({
  artifact,
  score,
  currentUserVote,
  isVoting,
  isDeleting,
  isOwner,
  handleVote,
  handleDelete,
}) {
  return (
    <div className="artifact-details-actions">
      <div className="artifact-voting details-voting">
        <button
          className={currentUserVote === 1 ? "active-vote" : ""}
          type="button"
          onClick={() => handleVote(1)}
          disabled={isVoting}
          aria-label={`Upvote ${artifact.title}`}
          aria-pressed={currentUserVote === 1}
        >
          ▲
        </button>

        <span className="artifact-score">
          {score}
        </span>

        <button
          className={currentUserVote === -1 ? "active-vote" : ""}
          type="button"
          onClick={() => handleVote(-1)}
          disabled={isVoting}
          aria-label={`Downvote ${artifact.title}`}
          aria-pressed={currentUserVote === -1}
        >
          ▼
        </button>
      </div>

      {isVoting && <span>Saving vote...</span>}

      {isOwner && (
        <>
          <Link to={`/artifacts/${artifact.id}/edit`}>
            Edit Post
          </Link>

          <button
            className="delete-button"
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        </>
      )}
    </div>
  );
}

export default ArtifactDetailsActions;