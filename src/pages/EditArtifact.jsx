import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import ArtifactForm from "../components/ArtifactForm";

function EditArtifact() {
  const { id } = useParams();
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

  const [artifactOwnerId, setArtifactOwnerId] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      fetchArtifact();
    }
  }, [id, user, authLoading]);

  async function fetchArtifact() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("artifact")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Unable to load artifact:", error);
      setErrorMessage("This entry could not be found.");
      setLoading(false);
      return;
    }

    if (data.user_id !== user.id) {
      setErrorMessage("You do not have permission to edit this post.");
      setLoading(false);
      return;
    }

    setArtifactOwnerId(data.user_id);

    setFormData({
      title: data.title || "",
      description: data.description || "",
      category: data.category || "",
      year: data.year || "",
      tags: data.tags || "",
    });

    setCurrentImageUrl(data.image_url || "");
    setLoading(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    setNewImageFile(event.target.files?.[0] || null);
  }

  async function uploadNewImage() {
    if (!newImageFile) {
      return currentImageUrl || null;
    }

    if (!user) {
      throw new Error("You must be logged in to upload an image.");
    }

    const fileExtension =
      newImageFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("artifact-images")
      .upload(filePath, newImageFile);

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("artifact-images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setErrorMessage("You must be logged in to edit this post.");
      return;
    }

    if (artifactOwnerId !== user.id) {
      setErrorMessage("You do not have permission to edit this post.");
      return;
    }

    setErrorMessage("");
    setIsUpdating(true);

    try {
      const imageUrl = await uploadNewImage();

      const { data, error } = await supabase
        .from("artifact")
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          image_url: imageUrl,
          year: formData.year.trim() || null,
          tags: formData.tags.trim() || null,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("The post could not be updated.");
      }

      navigate(`/artifacts/${id}`);
    } catch (error) {
      console.error("Unable to update artifact:", error);
      setErrorMessage(error.message || "Unable to update the post.");
      setIsUpdating(false);
    }
  }

  function handleCancel() {
    navigate(`/artifacts/${id}`);
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

  if (loading) {
    return (
      <main className="artifact-form-page">
        <p>Loading entry...</p>
      </main>
    );
  }

  if (errorMessage && !formData.title) {
    return (
      <main className="artifact-form-page">
        <p className="error-message">{errorMessage}</p>
      </main>
    );
  }

  return (
    <main className="artifact-form-page">
      <section className="artifact-form-header">
        <p className="archive-eyebrow">Edit this entry</p>

        <h2>Update Archive Entry</h2>

        <p>
          Fix any details, add missing information, or upload a different
          image.
        </p>
      </section>

      <section className="artifact-form-section">
        <ArtifactForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
          submitButtonText="Save Changes"
          submittingButtonText="Saving..."
          isSubmitting={isUpdating}
          handleCancel={handleCancel}
          currentImageUrl={currentImageUrl}
          newImageFile={newImageFile}
          handleImageChange={handleImageChange}
          imageLabel="Choose a New Image"
          imageHelperText="Optional. Leave this blank to keep the current image."
        />
      </section>
    </main>
  );
}

export default EditArtifact;