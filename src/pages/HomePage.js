import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import CountryTable from '../components/CountryTable';
import CountryForm from '../components/CountryForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import {
  fetchCountries,
  addCountry,
  updateCountry,
  deleteCountry,
} from '../api/countries';

function HomePage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);

  // Confirm dialog state
  const [countryToDelete, setCountryToDelete] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadCountries = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchCountries();
      setCountries(data);
    } catch (err) {
      setError('Failed to load countries. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  // Filtered + sorted countries
  const filteredCountries = countries
    .filter((c) =>
      c.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = a.country_name.toLowerCase();
      const nameB = b.country_name.toLowerCase();
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  // Handlers
  const handleAddClick = () => {
    setEditingCountry(null);
    setShowForm(true);
  };

  const handleEditClick = (country) => {
    setEditingCountry(country);
    setShowForm(true);
  };

  const handleDeleteClick = (country) => {
    setCountryToDelete(country);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCountry) {
        const updated = await updateCountry(editingCountry.id, formData);
        setCountries((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
        showToast(`"${updated.country_name}" updated successfully.`);
      } else {
        const added = await addCountry(formData);
        setCountries((prev) => [...prev, added]);
        showToast(`"${added.country_name}" added successfully.`);
      }
      setShowForm(false);
      setEditingCountry(null);
    } catch (err) {
      showToast(err.message || 'An error occurred. Please try again.', 'error');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCountry(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCountry(countryToDelete.id);
      setCountries((prev) => prev.filter((c) => c.id !== countryToDelete.id));
      showToast(`"${countryToDelete.country_name}" deleted.`);
    } catch (err) {
      showToast('Failed to delete. Please try again.', 'error');
    } finally {
      setCountryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setCountryToDelete(null);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <>
      <Navbar onAddClick={handleAddClick} />

      <main className="main-content">
        {/* Toast */}
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        )}

        <div className="content-header">
          <h1 className="page-title">Countries</h1>
          <p className="page-subtitle">Manage your country records</p>
        </div>

        {loading && <Loader />}

        {error && !loading && (
          <div className="error-box">
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={loadCountries}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <CountryTable
            countries={filteredCountries}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortOrder={sortOrder}
            onSortToggle={handleSortToggle}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </main>

      {showForm && (
        <CountryForm
          initialData={editingCountry}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {countryToDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${countryToDelete.country_name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}

export default HomePage;
