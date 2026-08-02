/**
 * votes.js — Voting logic
 *
 * All the up/down vote code lives here so voting works the same everywhere.
 * submitVote() records or changes a user's vote; getVoteScore() adds an
 * artifact's votes up into one number.
 */
import { supabase } from "./supabaseClient";

// Sums an artifact's votes into a single score. Upvotes are +1 and downvotes
// are -1, so this is just the running total. Shared by the feed, the card, and
// the details page so "the score" is computed the same way everywhere.
export function getVoteScore(artifact) {
  return (artifact.votes || []).reduce(
    (total, vote) => total + vote.vote_value,
    0
  );
}

// Applies a user's up/down vote to an artifact and returns the updated votes
// array. This is shared by the home feed and the details page so the voting
// rules live in exactly one place. It throws on any Supabase error; callers are
// expected to catch and surface the message.
//
// Three cases:
//   1. Clicking the same arrow you already picked  -> remove the vote (toggle off)
//   2. Clicking the opposite arrow                  -> switch the existing vote
//   3. No previous vote                             -> insert a new one
export async function submitVote(artifact, userId, voteValue) {
  const currentVotes = artifact.votes || [];
  const existingVote = currentVotes.find((vote) => vote.user_id === userId);

  // Case 1: same button pressed again -> delete the row and drop it locally.
  if (existingVote?.vote_value === voteValue) {
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return currentVotes.filter((vote) => vote.id !== existingVote.id);
  }

  // Case 2: switching up<->down -> update the existing row and swap it locally.
  if (existingVote) {
    const { data, error } = await supabase
      .from("votes")
      .update({ vote_value: voteValue })
      .eq("id", existingVote.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return currentVotes.map((vote) =>
      vote.id === existingVote.id ? data : vote
    );
  }

  // Case 3: first time voting -> insert a new row and append it locally.
  const { data, error } = await supabase
    .from("votes")
    .insert({
      artifact_id: artifact.id,
      user_id: userId,
      vote_value: voteValue,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return [...currentVotes, data];
}
