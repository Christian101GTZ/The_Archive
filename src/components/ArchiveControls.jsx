function ArchiveControls({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
}) {
  return (
    <div className="archive-controls">
      <div className="archive-control archive-search-control">
        <label htmlFor="artifact-search">
          Search the archive
        </label>

        <input
          id="artifact-search"
          type="search"
          placeholder="Search by title, category, description, or tags..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="archive-control archive-sort-control">
        <label htmlFor="artifact-sort">Sort by</label>

        <select
          id="artifact-sort"
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most-upvoted">Highest Score</option>
          <option value="title-az">Title A–Z</option>
        </select>
      </div>
    </div>
  );
}

export default ArchiveControls;