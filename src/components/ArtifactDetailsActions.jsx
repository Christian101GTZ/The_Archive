import { Link } from "react-router-dom";

function ArtifactDetailsActions({
  artifact,
  isUpvoting,
  isDeleting,
  handleUpvote,
  handleDelete,
}) {
  return (
    <div className="artifact-details-actions">
      <button
        type="button"
        onClick={handleUpvote}
        disabled={isUpvoting}
      >
        {isUpvoting
          ? "Upvoting..."
          : `▲ ${artifact.upvotes || 0} Upvotes`}
      </button>

      <Link to={`/artifacts/${artifact.id}/edit`}>
        Edit Artifact
      </Link>

      <button
        className="delete-button"
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Artifact"}
      </button>
    </div>
  );
}

export default ArtifactDetailsActions;