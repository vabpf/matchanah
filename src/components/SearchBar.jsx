import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = "Tìm kiếm...", value = "" }) => {
  const [searchInput, setSearchInput] = useState(value);

  useEffect(() => {
    setSearchInput(value);
  }, [value]);

  useEffect(() => {
    // Debounce search to avoid too many calls
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(searchInput);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, onSearch]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput);
    }
  };

  const handleClear = () => {
    setSearchInput('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchInput}
          onChange={handleInputChange}
        />
        <div className="search-actions">
          {searchInput && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="search-btn"
            aria-label="Tìm kiếm"
          >
            🔍
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
