/**
 * SubmitArtifact.jsx — Create-a-post page ("/submit")
 *
 * Lets a logged-in user add a new post. It handles the form state, uploads an
 * optional image to storage, saves the post to the database, then sends the
 * user back home. Visitors who aren't logged in are redirected to login.
 */
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import ArtifactForm from "../components/ArtifactForm";

function SubmitArtifact() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    year: "",
    tags: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    setImageFile(event.target.files?.[0] || null);
  }

  async function uploadImage() {
    if (!imageFile) {
      return null;
    }

    const fileExtension = imageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from("artifact-images")
      .upload(filePath, imageFile);

    if (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }

    const { data } = supabase.storage
      .from("artifact-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setErrorMessage("You must be logged in to create a post.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const imageUrl = await uploadImage();

      const { error } = await supabase.from("artifact").insert([
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          image_url: imageUrl,
          year: formData.year.trim() || null,
          tags: formData.tags.trim() || null,
          user_id: user.id,
        },
      ]);

      if (error) {
        throw error;
      }

      navigate("/");
    } catch (error) {
      console.error("Unable to create artifact:", error);
      setErrorMessage(error.message || "Unable to create the post.");
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  if (authLoading) {
    return (
      <main className="artifact-form-page">
        <p>Checking your account...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return (
    <main className="artifact-form-page">
      <section className="artifact-form-header">
        <p className="archive-eyebrow">Add a new entry</p>

        <h2>Submit to the Archive</h2>

        <p>
          Add a piece of media, an object, or a record that others should know
          about.
        </p>
      </section>

      <section className="artifact-form-section">
        <ArtifactForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
          submitButtonText="Add Entry"
          submittingButtonText="Adding Entry..."
          isSubmitting={isSubmitting}
          handleCancel={handleCancel}
          newImageFile={imageFile}
          handleImageChange={handleImageChange}
          imageLabel="Upload an Image"
          imageHelperText="Optional. Use a PNG, JPEG, or WebP file."
        />
      </section>
    </main>
  );
}

export default SubmitArtifact;