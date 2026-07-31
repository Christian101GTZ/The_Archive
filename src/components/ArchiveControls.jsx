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
          Find a post
        </label>

        <input
          id="artifact-search"
          type="search"
          placeholder="Search titles, categories, descriptions, or tags..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="archive-control archive-sort-control">
        <label htmlFor="artifact-sort">
          Sort posts
        </label>

        <select
          id="artifact-sort"
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most-upvoted">Top Rated</option>
          <option value="title-az">Title (A–Z)</option>
        </select>
      </div>
    </div>
  );
}

export default ArchiveControls;