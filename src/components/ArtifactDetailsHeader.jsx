function ArtifactDetailsHeader({ artifact }) {
  return (
    <header className="artifact-details-header">
      <p className="artifact-category">{artifact.category}</p>

      <h2>{artifact.title}</h2>

      {artifact.year && (
        <p className="artifact-year">
          Year or Time Period: {artifact.year}
        </p>
      )}
    </header>
  );
}

export default ArtifactDetailsHeader;