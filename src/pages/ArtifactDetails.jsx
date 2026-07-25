import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

import ArtifactDetailsHeader from "../components/ArtifactDetailsHeader";
import ArtifactDetailsActions from "../components/ArtifactDetailsActions";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

function ArtifactDetails() {
  // useParams reads the artifact ID from the URL.
  // Example URL: /artifacts/12
  // In that case, id would be "12".
  const { id } = useParams();

  // useNavigate lets the page redirect the user to another route.
  const navigate = useNavigate();

  // ==============================
  // Artifact and Comment Data
  // ==============================

  // Stores the artifact loaded from Supabase.
  // It starts as null because the data has not loaded yet.
  const [artifact, setArtifact] = useState(null);

  // Stores all comments connected to this artifact.
  const [comments, setComments] = useState([]);

  // Stores the text currently typed into the comment form.
  const [commentContent, setCommentContent] = useState("");

  // ==============================
  // Loading States
  // ==============================

  // Tracks whether the artifact is still loading.
  const [loading, setLoading] = useState(true);

  // Tracks whether the comments are still loading.
  const [commentsLoading, setCommentsLoading] = useState(true);

  // Prevents the delete button from being clicked repeatedly.
  const [isDeleting, setIsDeleting] = useState(false);

  // Prevents multiple upvotes from being sent at the same time.
  const [isUpvoting, setIsUpvoting] = useState(false);

  // Prevents the comment form from being submitted repeatedly.
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Stores the ID of the comment currently being deleted.
  // This allows only that comment's delete button to show "Deleting..."
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // ==============================
  // Error Messages
  // ==============================

  // Stores errors related to the artifact.
  const [errorMessage, setErrorMessage] = useState("");

  // Stores errors related to comments.
  const [commentError, setCommentError] = useState("");

  // ==============================
  // Load Data When the Page Opens
  // ==============================

  useEffect(() => {
    // Load the artifact and its comments when the component first appears.
    fetchArtifact();
    fetchComments();

    // This effect runs again if the artifact ID in the URL changes.
  }, [id]);

  // ==============================
  // Fetch the Artifact
  // ==============================

  async function fetchArtifact() {
    setLoading(true);
    setErrorMessage("");

    // Search the "artifact" table for one row with the matching ID.
    const { data, error } = await supabase
      .from("artifact")
      .select("*")
      .eq("id", id)
      .single();

    // If Supabase returns an error, show an error message.
    if (error) {
      console.error(error);
      setErrorMessage("Artifact could not be found.");
      setArtifact(null);
      setLoading(false);
      return;
    }

    // Save the artifact data in state so React can display it.
    setArtifact(data);

    // The artifact has finished loading.
    setLoading(false);
  }

  // ==============================
  // Fetch the Comments
  // ==============================

  async function fetchComments() {
    setCommentsLoading(true);
    setCommentError("");

    // Select comments that belong to the current artifact.
    // Newest comments appear first.
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("artifact_id", id)
      .order("created_at", { ascending: false });

    // Show an error if the comments could not be loaded.
    if (error) {
      console.error(error);
      setCommentError("Comments could not be loaded.");
      setCommentsLoading(false);
      return;
    }

    // Save the comments in state.
    // If data is missing, use an empty array instead.
    setComments(data || []);

    // The comments have finished loading.
    setCommentsLoading(false);
  }

  // ==============================
  // Upvote the Artifact
  // ==============================

  async function handleUpvote() {
    // Stop the function if the artifact has not loaded.
    if (!artifact) {
      return;
    }

    setIsUpvoting(true);
    setErrorMessage("");

    // Use the current number of upvotes and add one.
    // If upvotes is null, start from zero.
    const newUpvoteCount = (artifact.upvotes || 0) + 1;

    // Update the artifact's upvote count in Supabase.
    // select().single() returns the updated artifact.
    const { data, error } = await supabase
      .from("artifact")
      .update({
        upvotes: newUpvoteCount,
      })
      .eq("id", id)
      .select()
      .single();

    setIsUpvoting(false);

    // Show an error if the update fails.
    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      return;
    }

    // Replace the old artifact state with the updated record.
    // This updates the upvote number on the page.
    setArtifact(data);
  }

  // ==============================
  // Delete the Artifact
  // ==============================

  async function handleDelete() {
    // Ask for confirmation before permanently deleting the artifact.
    const confirmed = window.confirm(
      "Are you sure you want to delete this artifact?"
    );

    // Stop if the user selects Cancel.
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    // Delete the artifact row with the matching ID.
    const { error } = await supabase
      .from("artifact")
      .delete()
      .eq("id", id);

    // Show an error if the delete request fails.
    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      setIsDeleting(false);
      return;
    }

    // Redirect to the home page after a successful deletion.
    navigate("/");
  }

  // ==============================
  // Add a Comment
  // ==============================

  async function handleCommentSubmit(event) {
    // Prevent the browser from refreshing when the form is submitted.
    event.preventDefault();

    // Remove extra spaces from the beginning and end.
    const trimmedComment = commentContent.trim();

    // Do not allow an empty comment.
    if (!trimmedComment) {
      setCommentError("Please enter a comment.");
      return;
    }

    setIsPostingComment(true);
    setCommentError("");

    // Insert the new comment into Supabase.
    // artifact_id connects the comment to this artifact.
    const { data, error } = await supabase
      .from("comments")
      .insert({
        artifact_id: id,
        content: trimmedComment,
      })
      .select()
      .single();

    setIsPostingComment(false);

    // Show an error if the comment could not be added.
    if (error) {
      console.error(error);
      setCommentError(error.message);
      return;
    }

    // Add the new comment to the beginning of the current comments array.
    // This updates the page without fetching all comments again.
    setComments((currentComments) => [data, ...currentComments]);

    // Clear the textarea after the comment is posted.
    setCommentContent("");
  }

  // ==============================
  // Delete a Comment
  // ==============================

  async function handleDeleteComment(commentId) {
    // Ask for confirmation before deleting the comment.
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    // Stop if the user selects Cancel.
    if (!confirmed) {
      return;
    }

    // Save the comment ID so its button can show "Deleting..."
    setDeletingCommentId(commentId);
    setCommentError("");

    // Delete the selected comment from Supabase.
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    // Clear the deleting state after Supabase responds.
    setDeletingCommentId(null);

    // Show an error if the delete request fails.
    if (error) {
      console.error(error);
      setCommentError(error.message);
      return;
    }

    // Remove the deleted comment from the comments array.
    // filter keeps every comment except the deleted one.
    setComments((currentComments) =>
      currentComments.filter((comment) => comment.id !== commentId)
    );
  }

  // ==============================
  // Helper Function
  // ==============================

  function formatCommentDate(dateString) {
    // Convert the Supabase date into a readable local date and time.
    return new Date(dateString).toLocaleString();
  }

  // ==============================
  // Loading and Error Screens
  // ==============================

  // Show this while the artifact is being loaded.
  if (loading) {
    return <p>Loading artifact...</p>;
  }

  // Show this if the artifact does not exist or could not be loaded.
  if (!artifact) {
    return <p>{errorMessage || "Artifact could not be found."}</p>;
  }

  // ==============================
  // Page Content
  // ==============================

  return (
    <main className="artifact-details-page">
      <article className="artifact-details">
        {/* Displays the artifact category, title, and year. */}
        <ArtifactDetailsHeader artifact={artifact} />

        {/* Only display the image if the artifact has an image URL. */}
        {artifact.image_url && (
          <img
            className="artifact-details-image"
            src={artifact.image_url}
            alt={artifact.title}
          />
        )}

        {/* Displays the full artifact description. */}
        <p className="artifact-details-description">
          {artifact.description}
        </p>

        {/* Only display the tags section if tags were provided. */}
        {artifact.tags && (
          <p className="artifact-details-tags">
            <strong>Tags:</strong> {artifact.tags}
          </p>
        )}

        {/* Displays the upvote, edit, and delete controls. */}
        <ArtifactDetailsActions
          artifact={artifact}
          isUpvoting={isUpvoting}
          isDeleting={isDeleting}
          handleUpvote={handleUpvote}
          handleDelete={handleDelete}
        />

        {/* Displays artifact-related errors when they exist. */}
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}
      </article>

      <section className="comments-section">
        {/* The number updates whenever the comments array changes. */}
        <h3>Comments ({comments.length})</h3>

        {/* Displays the textarea and comment submission button. */}
        <CommentForm
          commentContent={commentContent}
          setCommentContent={setCommentContent}
          handleCommentSubmit={handleCommentSubmit}
          isPostingComment={isPostingComment}
        />

        {/* Displays comment-related errors when they exist. */}
        {commentError && (
          <p className="error-message">{commentError}</p>
        )}

        {/* Displays the loading message, empty state, or comment cards. */}
        <CommentList
          comments={comments}
          commentsLoading={commentsLoading}
          deletingCommentId={deletingCommentId}
          handleDeleteComment={handleDeleteComment}
          formatCommentDate={formatCommentDate}
        />

        {/* Returns the user to the home page. */}
        <Link className="back-home-link" to="/">
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}

export default ArtifactDetails;