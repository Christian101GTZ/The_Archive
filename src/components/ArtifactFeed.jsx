/**
 * ArtifactFeed.jsx — The list of posts
 *
 * Takes the list of posts and shows one ArtifactCard for each. If the list is
 * empty it shows a friendly "nothing here" message instead.
 */
import ArtifactCard from "./ArtifactCard";

function ArtifactFeed({
  artifacts,
  votingId,
  handleVote,
  currentUserId,
}) {
  if (artifacts.length === 0) {
    return (
      <div className="archive-empty-state">
        <h3>No artifacts found</h3>
        <p>Try another search or add something to the archive.</p>
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
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

export default ArtifactFeed;