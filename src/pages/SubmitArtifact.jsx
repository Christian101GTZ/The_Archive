import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

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

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    let imageUrl = null;

    if (imageFile) {
      const fileExtension = imageFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `artifacts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("artifact-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error(uploadError);
        setErrorMessage(`Image upload failed: ${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("artifact-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("artifact").insert([
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

    setIsSubmitting(false);

    if (insertError) {
      console.error(insertError);
      setErrorMessage(insertError.message);
      return;
    }

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
            <label htmlFor="image">Artifact Image</label>

            <input
              id="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
            />

            <p className="form-helper-text">
              Optional. Accepted formats: PNG, JPEG, and WebP.
            </p>

            {imageFile && (
              <p className="selected-file">
                Selected file: {imageFile.name}
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
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Artifact"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default SubmitArtifact;