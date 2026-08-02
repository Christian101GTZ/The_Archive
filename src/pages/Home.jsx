/**
 * Home.jsx — Home page (the "/" route)
 *
 * Loads every post and shows them in a feed. Lets the user search, sort, and
 * vote. The search and sort happen here in the browser on the already-loaded
 * list.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../services/supabaseClient";
import { submitVote, getVoteScore } from "../services/votes";
import { useAuth } from "../context/AuthContext";
import ArchiveControls from "../components/ArchiveControls";
import ArtifactFeed from "../components/ArtifactFeed";

function Home() {
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();

  const [artifacts, setArtifacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [votingId, setVotingId] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      fetchArtifacts();
    }
  }, [authLoading, user?.id]);

  async function fetchArtifacts() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("artifact")
      .select(`
        *,
        comments (
          id
        ),
        votes (
          id,
          user_id,
          vote_value
        )
      `);

    if (error) {
      console.error("Unable to load artifacts:", error);
      setErrorMessage("Artifacts could not be loaded.");
      setLoading(false);
      return;
    }

    setArtifacts(data || []);
    setLoading(false);
  }

  async function handleVote(artifact, voteValue) {
    if (!user) {
      navigate("/login", {
        state: {
          from: {
            pathname: "/",
          },
        },
      });

      return;
    }

    if (votingId) {
      return;
    }

    setVotingId(artifact.id);
    setErrorMessage("");

    try {
      const updatedVotes = await submitVote(artifact, user.id, voteValue);

      setArtifacts((currentArtifacts) =>
        currentArtifacts.map((currentArtifact) =>
          currentArtifact.id === artifact.id
            ? {
                ...currentArtifact,
                votes: updatedVotes,
              }
            : currentArtifact
        )
      );
    } catch (error) {
      console.error("Unable to save vote:", error);
      setErrorMessage(
        error.message || "The vote could not be recorded."
      );
    } finally {
      setVotingId(null);
    }
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
      return getVoteScore(b) - getVoteScore(a);
    }

    if (sortOption === "title-az") {
      return (a.title || "").localeCompare(b.title || "");
    }

    return 0;
  });

  if (loading || authLoading) {
    return (
      <main className="home-page">
        <p>Loading archive...</p>
      </main>
    );
  }

  return (
    <main className="home-page">
      <section className="archive-hero">
        <div className="archive-hero-content">
          <p className="archive-eyebrow">
            Community Archive
          </p>

          <h1>The Archive Project</h1>

          <p className="archive-hero-description">
            Share and document media, objects, and cultural material worth
            keeping.
          </p>

          <Link className="hero-submit-link" to="/submit">
            Add to the Archive
          </Link>
        </div>
      </section>

      <section className="archive-explore-section">
        <div className="archive-section-heading">
          <div>
            <p className="archive-eyebrow">
              Archive Entries
            </p>

            <h2>Browse Submissions</h2>
          </div>

          <p className="artifact-result-count">
            Showing {sortedArtifacts.length}{" "}
            {sortedArtifacts.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        <ArchiveControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        {errorMessage && (
          <p className="error-message">
            {errorMessage}
          </p>
        )}

        <ArtifactFeed
          artifacts={sortedArtifacts}
          votingId={votingId}
          handleVote={handleVote}
          currentUserId={user?.id || null}
        />
      </section>
    </main>
  );
}

export default Home;