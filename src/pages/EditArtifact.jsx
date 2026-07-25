import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import ArtifactForm from "../components/ArtifactForm";

function EditArtifact() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    year: "",
    tags: "",
  });

  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchArtifact();
  }, [id]);

  async function fetchArtifact() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("artifact")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setErrorMessage("Artifact could not be found.");
      setLoading(false);
      return;
    }

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

    const fileExtension = newImageFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `artifacts/${fileName}`;

    const { error } = await supabase.storage
      .from("artifact-images")
      .upload(filePath, newImageFile);

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

    setErrorMessage("");
    setIsUpdating(true);

    try {
      const imageUrl = await uploadNewImage();

      const { error } = await supabase
        .from("artifact")
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          image_url: imageUrl,
          year: formData.year.trim() || null,
          tags: formData.tags.trim() || null,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      navigate(`/artifacts/${id}`);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      setIsUpdating(false);
    }
  }

  function handleCancel() {
    navigate(`/artifacts/${id}`);
  }

  if (loading) {
    return (
      <main className="artifact-form-page">
        <p>Loading artifact...</p>
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
        <p className="archive-eyebrow">Update the collection</p>

        <h2>Edit Artifact</h2>

        <p>
          Correct information, add more historical context, or replace the
          artifact image.
        </p>
      </section>

      <section className="artifact-form-section">
        <ArtifactForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
          submitButtonText="Save Changes"
          submittingButtonText="Saving Changes..."
          isSubmitting={isUpdating}
          handleCancel={handleCancel}
          currentImageUrl={currentImageUrl}
          newImageFile={newImageFile}
          handleImageChange={handleImageChange}
          imageLabel="Replace Artifact Image"
          imageHelperText="Optional. Leave this empty to keep the current image."
        />
      </section>
    </main>
  );
}

export default EditArtifact;