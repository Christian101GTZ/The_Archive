/**
 * ArtifactDetails.jsx — Single post page ("/artifacts/:id")
 *
 * Shows one post in full with its image, details, and vote buttons. The owner
 * also sees Edit and Delete. Below the post is the comment section (its logic
 * comes from the useComments hook).
 */
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { supabase } from "../services/supabaseClient";
import { submitVote, getVoteScore } from "../services/votes";
import { useAuth } from "../context/AuthContext";
import { useComments } from "../hooks/useComments";

import ArtifactDetailsHeader from "../components/ArtifactDetailsHeader";
import ArtifactDetailsActions from "../components/ArtifactDetailsActions";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

function ArtifactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();

  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // All comment state and handlers live in this hook now.
  const {
    comments,
    commentContent,
    setCommentContent,
    commentsLoading,
    isPostingComment,
    deletingCommentId,
    commentError,
    handleCommentSubmit,
    handleDeleteComment,
    formatCommentDate,
  } = useComments(id, user, authLoading, navigate);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchArtifact();
  }, [id, authLoading, user?.id]);

  async function fetchArtifact() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("artifact")
      .select(`
        *,
        votes (
          id,
          user_id,
          vote_value
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Unable to load artifact:", error);
      setErrorMessage("This entry could not be found.");
      setArtifact(null);
      setLoading(false);
      return;
    }

    setArtifact(data);
    setLoading(false);
  }

  async function handleVote(voteValue) {
    if (!artifact) {
      return;
    }

    if (!user) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/artifacts/${id}`,
          },
        },
      });

      return;
    }

    if (isVoting) {
      return;
    }

    setIsVoting(true);
    setErrorMessage("");

    try {
      const updatedVotes = await submitVote(artifact, user.id, voteValue);

      setArtifact((currentArtifact) => ({
        ...currentArtifact,
        votes: updatedVotes,
      }));
    } catch (error) {
      console.error("Unable to save vote:", error);
      setErrorMessage(
        error.message || "Your vote could not be saved."
      );
    } finally {
      setIsVoting(false);
    }
  }

  async function handleDelete() {
    if (!artifact || !user || artifact.user_id !== user.id) {
      setErrorMessage(
        "You do not have permission to delete this post."
      );
      return;
    }

    const confirmed = window.confirm(
      "Delete this archive entry? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("artifact")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Unable to delete artifact:", error);
      setErrorMessage("This entry could not be deleted.");
      setIsDeleting(false);
      return;
    }

    navigate("/");
  }

  if (loading || authLoading) {
    return <p>Loading entry...</p>;
  }

  if (!artifact) {
    return (
      <p>
        {errorMessage || "This entry could not be found."}
      </p>
    );
  }

  const votes = artifact.votes || [];

  const score = getVoteScore(artifact);

  const currentUserVote =
    votes.find((vote) => vote.user_id === user?.id)
      ?.vote_value || 0;

  const isOwner = Boolean(
    user && artifact.user_id === user.id
  );

  return (
    <main className="artifact-details-page">
      <article className="artifact-details">
        <ArtifactDetailsHeader artifact={artifact} />

        {artifact.image_url && (
          <img
            className="artifact-details-image"
            src={artifact.image_url}
            alt={artifact.title}
          />
        )}

        <p className="artifact-details-description">
          {artifact.description}
        </p>

        {artifact.tags && (
          <p className="artifact-details-tags">
            <strong>Filed under:</strong> {artifact.tags}
          </p>
        )}

        <ArtifactDetailsActions
          artifact={artifact}
          score={score}
          currentUserVote={currentUserVote}
          isVoting={isVoting}
          isDeleting={isDeleting}
          isOwner={isOwner}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />

        {errorMessage && (
          <p className="error-message">
            {errorMessage}
          </p>
        )}
      </article>

      <section className="comments-section">
        <h3>Discussion ({comments.length})</h3>

        {user ? (
          <CommentForm
            commentContent={commentContent}
            setCommentContent={setCommentContent}
            handleCommentSubmit={handleCommentSubmit}
            isPostingComment={isPostingComment}
          />
        ) : (
          <p className="comment-login-message">
            <Link
              to="/login"
              state={{
                from: {
                  pathname: `/artifacts/${id}`,
                },
              }}
            >
              Log in
            </Link>{" "}
            to join the discussion.
          </p>
        )}

        {commentError && (
          <p className="error-message">
            {commentError}
          </p>
        )}

        <CommentList
          comments={comments}
          commentsLoading={commentsLoading}
          deletingCommentId={deletingCommentId}
          handleDeleteComment={handleDeleteComment}
          formatCommentDate={formatCommentDate}
          currentUserId={user?.id}
        />

        <Link className="back-home-link" to="/">
          ← Return to the Archive
        </Link>
      </section>
    </main>
  );
}

export default ArtifactDetails;