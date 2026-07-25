import { Link } from "react-router-dom";

function ArtifactCard({
  artifact,
  isVoting,
  handleVote,
}) {
  const hasImage = Boolean(artifact.image_url);
  const commentCount = artifact.comments?.length || 0;

  return (
    <article
      className={`artifact-card ${
        hasImage ? "with-image" : "without-image"
      }`}
    >
      <div className="artifact-card-content">
        <p className="artifact-category">
          {artifact.category || "Uncategorized"}
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
              type="button"
              onClick={() => handleVote(artifact, 1)}
              disabled={isVoting}
              aria-label={`Upvote ${artifact.title}`}
            >
              ▲
            </button>

            <span className="artifact-score">
              {artifact.upvotes || 0}
            </span>

            <button
              type="button"
              onClick={() => handleVote(artifact, -1)}
              disabled={isVoting}
              aria-label={`Downvote ${artifact.title}`}
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
            View Artifact →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ArtifactCard;