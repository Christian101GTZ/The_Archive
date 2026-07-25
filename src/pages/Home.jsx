import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import ArchiveControls from "../components/ArchiveControls";
import ArtifactFeed from "../components/ArtifactFeed";

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

        <ArchiveControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}

        <ArtifactFeed
          artifacts={sortedArtifacts}
          votingId={votingId}
          handleVote={handleVote}
        />
      </section>
    </main>
  );
}

export default Home;