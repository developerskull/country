import React from 'react';
import { useNavigate } from 'react-router-dom';

function CountryTable({ countries, searchTerm, onSearchChange, sortOrder, onSortToggle, onEdit, onDelete }) {
  const navigate = useNavigate();

  const formatPopulation = (pop) => {
    if (!pop && pop !== 0) return '—';
    return Number(pop).toLocaleString();
  };

  return (
    <div className="table-wrapper">
      {/* Search and Sort controls */}
      <div className="table-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            placeholder="Search by country name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => onSearchChange('')} title="Clear search">
              ✕
            </button>
          )}
        </div>
        <button
          id="sort-toggle-btn"
          className="btn btn-outline"
          onClick={onSortToggle}
          title={`Sort: ${sortOrder === 'asc' ? 'A → Z' : 'Z → A'}`}
        >
          {sortOrder === 'asc' ? '↑ A–Z' : '↓ Z–A'}
        </button>
      </div>

      {/* Results count */}
      <p className="results-count">
        {countries.length === 0
          ? 'No countries found.'
          : `Showing ${countries.length} countr${countries.length === 1 ? 'y' : 'ies'}`}
      </p>

      {countries.length > 0 ? (
        <div className="table-scroll">
          <table className="country-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Country</th>
                <th>Code</th>
                <th>Capital</th>
                <th>Continent</th>
                <th>Currency</th>
                <th>Population</th>
                <th>Language</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country, index) => (
                <tr key={country.id} className="table-row">
                  <td className="row-num">{index + 1}</td>
                  <td className="country-name-cell">
                    <strong>{country.country_name}</strong>
                  </td>
                  <td>
                    <span className="badge">{country.country_code}</span>
                  </td>
                  <td>{country.capital}</td>
                  <td>{country.continent}</td>
                  <td>{country.currency}</td>
                  <td className="population-cell">{formatPopulation(country.population)}</td>
                  <td>{country.language}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon btn-view"
                      title="View Details"
                      onClick={() => navigate(`/country/${country.id}`)}
                    >
                      👁
                    </button>
                    <button
                      className="btn-icon btn-edit"
                      title="Edit"
                      onClick={() => onEdit(country)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      title="Delete"
                      onClick={() => onDelete(country)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>🌍</p>
          <p>No countries match your search.</p>
        </div>
      )}
    </div>
  );
}

export default CountryTable;
