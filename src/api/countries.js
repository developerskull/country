import { supabase } from '../supabase';

// Fetch all countries ordered by name
export async function fetchCountries() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('country_name', { ascending: true });

  if (error) throw error;
  return data;
}

// Fetch a single country by ID
export async function fetchCountryById(id) {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Add a new country
export async function addCountry(countryData) {
  const { data, error } = await supabase
    .from('countries')
    .insert([countryData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update an existing country by ID
export async function updateCountry(id, countryData) {
  const { data, error } = await supabase
    .from('countries')
    .update(countryData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a country by ID
export async function deleteCountry(id) {
  const { error } = await supabase
    .from('countries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
