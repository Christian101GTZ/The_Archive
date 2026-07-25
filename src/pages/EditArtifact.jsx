import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

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

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setIsUpdating(true);

    let imageUrl = currentImageUrl || null;

    if (newImageFile) {
      const fileExtension = newImageFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `artifacts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("artifact-images")
        .upload(filePath, newImageFile);

      if (uploadError) {
        console.error(uploadError);
        setErrorMessage(`Image upload failed: ${uploadError.message}`);
        setIsUpdating(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("artifact-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
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

    setIsUpdating(false);

    if (updateError) {
      console.error(updateError);
      setErrorMessage(updateError.message);
      return;
    }

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
        <form className="artifact-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">
              Title <span aria-hidden="true">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter the artifact title"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">
              Description <span aria-hidden="true">*</span>
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain what this artifact is and why it should be preserved."
              required
            />

            <p className="form-helper-text">
              Include useful historical, cultural, or preservation details.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="category">
              Category <span aria-hidden="true">*</span>
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Physical Media">Physical Media</option>
              <option value="Lost Media">Lost Media</option>
              <option value="Preservation Project">
                Preservation Project
              </option>
              <option value="Historical Documentation">
                Historical Documentation
              </option>
              <option value="Games">Games</option>
              <option value="Film and Television">
                Film and Television
              </option>
              <option value="Music">Music</option>
              <option value="Books and Magazines">
                Books and Magazines
              </option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="image">Replace Artifact Image</label>

            {currentImageUrl && (
              <div className="current-artifact-image">
                <p className="form-helper-text">Current image:</p>

                <img
                  src={currentImageUrl}
                  alt={`Current image for ${formData.title}`}
                />
              </div>
            )}

            <input
              id="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
            />

            <p className="form-helper-text">
              Optional. Leave this empty to keep the current image.
            </p>

            {newImageFile && (
              <p className="selected-file">
                New image selected: {newImageFile.name}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="year">Year or Time Period</label>

            <input
              id="year"
              name="year"
              type="text"
              value={formData.year}
              onChange={handleChange}
              placeholder="Example: 1988, Early 1990s, Unknown"
            />
          </div>

          <div className="form-field">
            <label htmlFor="tags">Tags</label>

            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Example: Nintendo, magazine, gaming history"
            />

            <p className="form-helper-text">
              Separate related topics with commas.
            </p>
          </div>

          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(`/artifacts/${id}`)}
              disabled={isUpdating}
            >
              Cancel
            </button>

            <button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditArtifact;