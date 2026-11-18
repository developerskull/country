import React, { useState, useEffect } from 'react';

const CONTINENTS = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
];

const EMPTY_FORM = {
  country_name: '',
  country_code: '',
  capital: '',
  continent: '',
  currency: '',
  population: '',
  language: '',
};

function CountryForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        country_name: initialData.country_name || '',
        country_code: initialData.country_code || '',
        capital: initialData.capital || '',
        continent: initialData.continent || '',
        currency: initialData.currency || '',
        population: initialData.population || '',
        language: initialData.language || '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.country_name.trim()) newErrors.country_name = 'Country name is required.';
    if (!formData.country_code.trim()) newErrors.country_code = 'Country code is required.';
    else if (formData.country_code.trim().length > 3)
      newErrors.country_code = 'Country code must be 2–3 characters.';
    if (!formData.capital.trim()) newErrors.capital = 'Capital is required.';
    if (!formData.continent) newErrors.continent = 'Continent is required.';
    if (!formData.currency.trim()) newErrors.currency = 'Currency is required.';
    if (!formData.population || isNaN(formData.population) || Number(formData.population) < 0)
      newErrors.population = 'Valid population is required.';
    if (!formData.language.trim()) newErrors.language = 'Language is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      ...formData,
      country_code: formData.country_code.toUpperCase().trim(),
      country_name: formData.country_name.trim(),
      capital: formData.capital.trim(),
      currency: formData.currency.trim(),
      language: formData.language.trim(),
      population: parseInt(formData.population, 10),
    });
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="modal-overlay">
      <div className="modal-box form-box">
        <h2 className="modal-title">{isEditing ? 'Edit Country' : 'Add New Country'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="country_name">Country Name</label>
              <input
                id="country_name"
                name="country_name"
                type="text"
                value={formData.country_name}
                onChange={handleChange}
                placeholder="e.g. India"
                className={errors.country_name ? 'input-error' : ''}
              />
              {errors.country_name && <span className="field-error">{errors.country_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="country_code">Country Code</label>
              <input
                id="country_code"
                name="country_code"
                type="text"
                value={formData.country_code}
                onChange={handleChange}
                placeholder="e.g. IN"
                maxLength={3}
                className={errors.country_code ? 'input-error' : ''}
              />
              {errors.country_code && <span className="field-error">{errors.country_code}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="capital">Capital</label>
              <input
                id="capital"
                name="capital"
                type="text"
                value={formData.capital}
                onChange={handleChange}
                placeholder="e.g. New Delhi"
                className={errors.capital ? 'input-error' : ''}
              />
              {errors.capital && <span className="field-error">{errors.capital}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="continent">Continent</label>
              <select
                id="continent"
                name="continent"
                value={formData.continent}
                onChange={handleChange}
                className={errors.continent ? 'input-error' : ''}
              >
                <option value="">Select Continent</option>
                {CONTINENTS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.continent && <span className="field-error">{errors.continent}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <input
                id="currency"
                name="currency"
                type="text"
                value={formData.currency}
                onChange={handleChange}
                placeholder="e.g. Indian Rupee (INR)"
                className={errors.currency ? 'input-error' : ''}
              />
              {errors.currency && <span className="field-error">{errors.currency}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="population">Population</label>
              <input
                id="population"
                name="population"
                type="number"
                value={formData.population}
                onChange={handleChange}
                placeholder="e.g. 1400000000"
                min="0"
                className={errors.population ? 'input-error' : ''}
              />
              {errors.population && <span className="field-error">{errors.population}</span>}
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="language">Language</label>
              <input
                id="language"
                name="language"
                type="text"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g. Hindi, English"
                className={errors.language ? 'input-error' : ''}
              />
              {errors.language && <span className="field-error">{errors.language}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Add Country'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CountryForm;
