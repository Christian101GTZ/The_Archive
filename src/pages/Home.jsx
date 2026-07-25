import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

function Home() {
  const [artifacts, setArtifacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [votingId, setVotingId] = useState(null);

  useEffect(() => {
    fetchArtifacts();
  }, []);

  async function fetchArtifacts() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("artifact")
      .select(`
        *,
        comments (
          id
        )
      `);

    if (error) {
      console.error(error);
      setErrorMessage("Artifacts could not be loaded.");
      setLoading(false);
      return;
    }

    setArtifacts(data || []);
    setLoading(false);
  }

  async function handleVote(artifact, amount) {
    setVotingId(artifact.id);
    setErrorMessage("");

    const newVoteCount = (artifact.upvotes || 0) + amount;

    const { data, error } = await supabase
      .from("artifact")
      .update({
        upvotes: newVoteCount,
      })
      .eq("id", artifact.id)
      .select()
      .single();

    setVotingId(null);

    if (error) {
      console.error(error);
      setErrorMessage("The vote could not be recorded.");
      return;
    }

    setArtifacts((currentArtifacts) =>
      currentArtifacts.map((currentArtifact) =>
        currentArtifact.id === data.id
          ? {
              ...currentArtifact,
              ...data,
            }
          : currentArtifact
      )
    );
  }

  const filteredArtifacts = artifacts.filter((artifact) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      artifact.title?.toLowerCase().includes(search) ||
      artifact.description?.toLowerCase().includes(search) ||
      artifact.category?.toLowerCase().includes(search) ||
      artifact.tags?.toLowerCase().includes(search)
    );
  });

  const sortedArtifacts = [...filteredArtifacts].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    }

    if (sortOption === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    }

    if (sortOption === "most-upvoted") {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }

    if (sortOption === "title-az") {
      return (a.title || "").localeCompare(b.title || "");
    }

    return 0;
  });

  if (loading) {
    return (
      <main className="home-page">
        <p>Loading artifacts...</p>
      </main>
    );
  }

  return (
    <main className="home-page">
      <section className="archive-hero">
        <div className="archive-hero-content">
          <p className="archive-eyebrow">
            Community Preservation Archive
          </p>

          <h1>The Archive Project</h1>

          <p className="archive-hero-description">
            Preserve media, historical artifacts, and cultural works before
            they are forgotten.
          </p>

          <Link className="hero-submit-link" to="/submit">
            Submit an Artifact
          </Link>
        </div>
      </section>

      <section className="archive-explore-section">
        <div className="archive-section-heading">
          <div>
            <p className="archive-eyebrow">Browse the collection</p>
            <h2>Explore the Archive</h2>
          </div>

          <p className="artifact-result-count">
            Showing {sortedArtifacts.length}{" "}
            {sortedArtifacts.length === 1 ? "artifact" : "artifacts"}
          </p>
        </div>

        <div className="archive-controls">
          <div className="archive-control archive-search-control">
            <label htmlFor="artifact-search">
              Search the archive
            </label>

            <input
              id="artifact-search"
              type="search"
              placeholder="Search by title, category, description, or tags..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="archive-control archive-sort-control">
            <label htmlFor="artifact-sort">Sort by</label>

            <select
              id="artifact-sort"
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value)
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most-upvoted">Highest Score</option>
              <option value="title-az">Title A–Z</option>
            </select>
          </div>
        </div>

        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}

        {sortedArtifacts.length === 0 ? (
          <div className="archive-empty-state">
            <h3>No artifacts found</h3>

            <p>
              Try changing your search terms or submit a new artifact.
            </p>

            <Link to="/submit">Submit an Artifact</Link>
          </div>
        ) : (
          <div className="artifact-feed">
            {sortedArtifacts.map((artifact) => {
              const hasImage = Boolean(artifact.image_url);
              const isVoting = votingId === artifact.id;
              const commentCount =
                artifact.comments?.length || 0;

              return (
                <article
                  key={artifact.id}
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
                          onClick={() =>
                            handleVote(artifact, 1)
                          }
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
                          onClick={() =>
                            handleVote(artifact, -1)
                          }
                          disabled={isVoting}
                          aria-label={`Downvote ${artifact.title}`}
                        >
                          ▼
                        </button>
                      </div>

                      <span className="artifact-comment-count">
                        💬 {commentCount}{" "}
                        {commentCount === 1
                          ? "Comment"
                          : "Comments"}
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
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;