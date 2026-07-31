import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

import ArtifactDetailsHeader from "../components/ArtifactDetailsHeader";
import ArtifactDetailsActions from "../components/ArtifactDetailsActions";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

function ArtifactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();

  const [artifact, setArtifact] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isPostingComment, setIsPostingComment] =
    useState(false);
  const [deletingCommentId, setDeletingCommentId] =
    useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchArtifact();
    fetchComments();
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

  async function fetchComments() {
    setCommentsLoading(true);
    setCommentError("");

    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        artifact_id,
        user_id,
        content,
        created_at
      `)
      .eq("artifact_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Unable to load comments:", error);
      setCommentError("The discussion could not be loaded.");
      setComments([]);
      setCommentsLoading(false);
      return;
    }

    setComments(data || []);
    setCommentsLoading(false);
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

    const existingVote = artifact.votes?.find(
      (vote) => vote.user_id === user.id
    );

    try {
      let updatedVotes = artifact.votes || [];

      if (existingVote?.vote_value === voteValue) {
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("id", existingVote.id)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        updatedVotes = updatedVotes.filter(
          (vote) => vote.id !== existingVote.id
        );
      } else if (existingVote) {
        const { data, error } = await supabase
          .from("votes")
          .update({
            vote_value: voteValue,
          })
          .eq("id", existingVote.id)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        updatedVotes = updatedVotes.map((vote) =>
          vote.id === existingVote.id ? data : vote
        );
      } else {
        const { data, error } = await supabase
          .from("votes")
          .insert({
            artifact_id: artifact.id,
            user_id: user.id,
            vote_value: voteValue,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        updatedVotes = [...updatedVotes, data];
      }

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

  async function handleCommentSubmit(event) {
    event.preventDefault();

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

    if (isPostingComment) {
      return;
    }

    const trimmedComment = commentContent.trim();

    if (!trimmedComment) {
      setCommentError("Write something before posting.");
      return;
    }

    setIsPostingComment(true);
    setCommentError("");

    const { data, error } = await supabase
      .from("comments")
      .insert({
        artifact_id: id,
        user_id: user.id,
        content: trimmedComment,
      })
      .select(`
        id,
        artifact_id,
        user_id,
        content,
        created_at
      `)
      .single();

    setIsPostingComment(false);

    if (error) {
      console.error("Unable to post comment:", error);
      setCommentError(
        error.message || "Your comment could not be posted."
      );
      return;
    }

    setComments((currentComments) => [
      data,
      ...currentComments,
    ]);

    setCommentContent("");
  }

  async function handleDeleteComment(commentId) {
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

    const commentToDelete = comments.find(
      (comment) => comment.id === commentId
    );

    if (!commentToDelete) {
      setCommentError("That comment could not be found.");
      return;
    }

    if (commentToDelete.user_id !== user.id) {
      setCommentError(
        "You do not have permission to delete this comment."
      );
      return;
    }

    const confirmed = window.confirm("Delete this comment?");

    if (!confirmed) {
      return;
    }

    setDeletingCommentId(commentId);
    setCommentError("");

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    setDeletingCommentId(null);

    if (error) {
      console.error("Unable to delete comment:", error);
      setCommentError(
        error.message || "The comment could not be deleted."
      );
      return;
    }

    setComments((currentComments) =>
      currentComments.filter(
        (comment) => comment.id !== commentId
      )
    );
  }

  function formatCommentDate(dateString) {
    return new Date(dateString).toLocaleString();
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

  const score = votes.reduce(
    (total, vote) => total + vote.vote_value,
    0
  );

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