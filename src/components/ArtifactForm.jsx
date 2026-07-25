function ArtifactForm({
  formData,
  handleChange,
  handleSubmit,
  errorMessage,
  submitButtonText,
  submittingButtonText = "Saving...",
  isSubmitting,
  handleCancel,
  currentImageUrl = "",
  newImageFile = null,
  handleImageChange,
  imageLabel = "Artifact Image",
  imageHelperText = "Optional. Upload a PNG, JPEG, or WebP image.",
}) {
  return (
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
        <label htmlFor="image">{imageLabel}</label>

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

        <p className="form-helper-text">{imageHelperText}</p>

        {newImageFile && (
          <p className="selected-file">
            Selected file: {newImageFile.name}
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
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingButtonText : submitButtonText}
        </button>
      </div>
    </form>
  );
}

export default ArtifactForm;