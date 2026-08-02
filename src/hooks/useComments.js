/**
 * useComments.js — Comments logic for a post
 *
 * A custom hook that handles everything about the discussion section: loading a
 * post's comments, adding a new one, and deleting your own. Kept separate so the
 * ArtifactDetails page stays focused on the post itself.
 */
import { useEffect, useState } from "react";

import { supabase } from "../services/supabaseClient";

// The columns we read back for every comment. Kept in one constant so the
// fetch and the insert stay in sync.
const COMMENT_FIELDS = `
  id,
  artifact_id,
  user_id,
  content,
  created_at
`;

// Everything the discussion section needs, bundled into one hook: loading the
// comments for an artifact, posting a new one, and deleting your own. The
// details page just consumes the values it returns — none of this logic has to
// live in the component anymore.
//
// `navigate` is passed in so the hook can bounce logged-out users to /login
// (and back) without owning the router itself.
export function useComments(artifactId, user, authLoading, navigate) {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [commentError, setCommentError] = useState("");

  // Load the discussion once auth has resolved, and reload if the artifact or
  // the signed-in user changes.
  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artifactId, authLoading, user?.id]);

  // Sends a logged-out user to the login page, remembering where to return to.
  function redirectToLogin() {
    navigate("/login", {
      state: {
        from: {
          pathname: `/artifacts/${artifactId}`,
        },
      },
    });
  }

  async function fetchComments() {
    setCommentsLoading(true);
    setCommentError("");

    const { data, error } = await supabase
      .from("comments")
      .select(COMMENT_FIELDS)
      .eq("artifact_id", artifactId)
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

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!user) {
      redirectToLogin();
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
        artifact_id: artifactId,
        user_id: user.id,
        content: trimmedComment,
      })
      .select(COMMENT_FIELDS)
      .single();

    setIsPostingComment(false);

    if (error) {
      console.error("Unable to post comment:", error);
      setCommentError(error.message || "Your comment could not be posted.");
      return;
    }

    // Add the new comment to the top of the list and clear the input.
    setComments((currentComments) => [data, ...currentComments]);
    setCommentContent("");
  }

  async function handleDeleteComment(commentId) {
    if (!user) {
      redirectToLogin();
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
      setCommentError("You do not have permission to delete this comment.");
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
      setCommentError(error.message || "The comment could not be deleted.");
      return;
    }

    setComments((currentComments) =>
      currentComments.filter((comment) => comment.id !== commentId)
    );
  }

  // Turns a stored timestamp into a human-readable local date/time string.
  function formatCommentDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  return {
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
  };
}
