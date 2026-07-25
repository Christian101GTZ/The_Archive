import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import ArtifactForm from "../components/ArtifactForm";

function SubmitArtifact() {
  const navigate = useNavigate();

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
    const filePath = `artifacts/${fileName}`;

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
          upvotes: 0,
        },
      ]);

      if (error) {
        throw error;
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <main className="artifact-form-page">
      <section className="artifact-form-header">
        <p className="archive-eyebrow">Contribute to the collection</p>

        <h2>Submit an Artifact</h2>

        <p>
          Document media, historical material, or cultural artifacts worth
          preserving.
        </p>
      </section>

      <section className="artifact-form-section">
        <ArtifactForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
          submitButtonText="Submit Artifact"
          submittingButtonText="Submitting..."
          isSubmitting={isSubmitting}
          handleCancel={handleCancel}
          newImageFile={imageFile}
          handleImageChange={handleImageChange}
          imageLabel="Artifact Image"
          imageHelperText="Optional. Accepted formats: PNG, JPEG, and WebP."
        />
      </section>
    </main>
  );
}

export default SubmitArtifact;