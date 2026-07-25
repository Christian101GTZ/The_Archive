import { Link } from "react-router-dom";

function ArtifactCard({ artifact }) {
  return (
    <article className="artifact-card">
      <h3>{artifact.title}</h3>

      <p>{artifact.description}</p>

      <p>
        <strong>Category:</strong> {artifact.category}
      </p>

      {artifact.year && (
        <p>
          <strong>Year:</strong> {artifact.year}
        </p>
      )}

      {artifact.tags && (
        <p>
          <strong>Tags:</strong> {artifact.tags}
        </p>
      )}

      <p>👍 {artifact.upvotes} Upvotes</p>

      {artifact.image_url && (
        <img
          src={artifact.image_url}
          alt={artifact.title}
          width="250"
        />
      )}

      <div>
        <Link to={`/artifacts/${artifact.id}`}>View Artifact</Link>
      </div>
    </article>
  );
}

export default ArtifactCard;