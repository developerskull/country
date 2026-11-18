import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCountryById } from '../api/countries';
import Loader from '../components/Loader';

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || '—'}</span>
    </div>
  );
}

function CountryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCountryById(id);
        setCountry(data);
      } catch (err) {
        setError('Country not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="page-container">
        <div className="error-box">
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatPopulation = (pop) => {
    if (!pop && pop !== 0) return '—';
    return Number(pop).toLocaleString();
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString();
  };

  return (
    <div className="page-container">
      <div className="detail-card">
        <div className="detail-header">
          <div>
            <h1 className="detail-country-name">{country.country_name}</h1>
            <span className="detail-badge">{country.country_code}</span>
          </div>
          <button
            id="back-btn"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            ← Back
          </button>
        </div>

        <div className="detail-section">
          <h2 className="detail-section-title">General Information</h2>
          <div className="detail-grid">
            <DetailRow label="Capital" value={country.capital} />
            <DetailRow label="Continent" value={country.continent} />
            <DetailRow label="Currency" value={country.currency} />
            <DetailRow label="Language" value={country.language} />
            <DetailRow label="Population" value={formatPopulation(country.population)} />
            <DetailRow label="Country Code" value={country.country_code} />
          </div>
        </div>

        <div className="detail-section">
          <h2 className="detail-section-title">Record Info</h2>
          <div className="detail-grid">
            <DetailRow label="Record ID" value={country.id} />
            <DetailRow label="Created At" value={formatDate(country.created_at)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryDetailPage;
