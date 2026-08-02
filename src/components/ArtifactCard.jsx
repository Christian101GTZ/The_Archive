/**
 * ArtifactCard.jsx — One post in the feed
 *
 * The preview card for a single post: its category, title, image, description,
 * vote buttons, comment count, and a link to the full post.
 */
import { Link } from "react-router-dom";

import { getVoteScore } from "../services/votes";

function ArtifactCard({
  artifact,
  isVoting,
  handleVote,
  currentUserId,
}) {
  const hasImage = Boolean(artifact.image_url);
  const commentCount = artifact.comments?.length || 0;
  const votes = artifact.votes || [];

  const score = getVoteScore(artifact);

  const currentUserVote =
    votes.find((vote) => vote.user_id === currentUserId)?.vote_value || 0;

  return (
    <article
      className={`artifact-card ${
        hasImage ? "with-image" : "without-image"
      }`}
    >
      <div className="artifact-card-content">
        <p className="artifact-category">
          {artifact.category || "General"}
        </p>

        <Link
          className="artifact-title-link"
          to={`/artifacts/${artifact.id}`}
        >
          <h3
            className={
              hasImage
                ? "artifact-title"
                : "artifact-title text-post-title"
            }
          >
            {artifact.title}
          </h3>
        </Link>

        {hasImage && (
          <Link
            className="artifact-image-link"
            to={`/artifacts/${artifact.id}`}
          >
            <img
              className="artifact-image"
              src={artifact.image_url}
              alt={artifact.title}
            />
          </Link>
        )}

        <p className="artifact-description">
          {artifact.description}
        </p>

        <div className="artifact-metadata">
          {artifact.year && (
            <span className="artifact-metadata-item">
              {artifact.year}
            </span>
          )}

          {artifact.tags && (
            <span className="artifact-metadata-item">
              {artifact.tags}
            </span>
          )}
        </div>

        <div className="artifact-actions">
          <div className="artifact-voting">
            <button
              className={currentUserVote === 1 ? "active-vote" : ""}
              type="button"
              onClick={() => handleVote(artifact, 1)}
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
              onClick={() => handleVote(artifact, -1)}
              disabled={isVoting}
              aria-label={`Downvote ${artifact.title}`}
              aria-pressed={currentUserVote === -1}
            >
              ▼
            </button>
          </div>

          <span className="artifact-comment-count">
            💬 {commentCount}{" "}
            {commentCount === 1 ? "Comment" : "Comments"}
          </span>

          <Link
            className="view-artifact-link"
            to={`/artifacts/${artifact.id}`}
          >
            View Post →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ArtifactCard;