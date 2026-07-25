import { Link } from "react-router-dom";
import ArtifactCard from "./ArtifactCard";

function ArtifactFeed({
  artifacts,
  votingId,
  handleVote,
}) {
  if (artifacts.length === 0) {
    return (
      <div className="archive-empty-state">
        <h3>No artifacts found</h3>

        <p>
          Try changing your search terms or submit a new artifact.
        </p>

        <Link to="/submit">Submit an Artifact</Link>
      </div>
    );
  }

  return (
    <div className="artifact-feed">
      {artifacts.map((artifact) => (
        <ArtifactCard
          key={artifact.id}
          artifact={artifact}
          isVoting={votingId === artifact.id}
          handleVote={handleVote}
        />
      ))}
    </div>
  );
}

export default ArtifactFeed;