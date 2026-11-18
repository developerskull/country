require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const axios = require('axios');

async function fetchCountries() {
  const response = await axios.get('https://raw.githubusercontent.com/mledoze/countries/master/countries.json');
  return response.data;
}

async function seedDatabase() {
  console.log('Fetching data from GitHub dataset...');
  
  try {
    const rawCountries = await fetchCountries();
    console.log(`Fetched ${rawCountries.length} countries. Preparing data...`);

    const formattedData = rawCountries.map((c) => {
      // Safe extractions
      const capital = c.capital && c.capital.length > 0 ? c.capital[0] : 'None';
      const currencyCode = c.currencies ? Object.keys(c.currencies)[0] : 'None';
      const currencyName = c.currencies && currencyCode !== 'None' ? (c.currencies[currencyCode]?.name || 'None') : 'None';
      const language = c.languages ? Object.values(c.languages).join(', ') : 'None';
      const timezones = c.timezones ? c.timezones.join(', ') : 'None';
      const callingCode = c.idd && c.idd.root ? c.idd.root + (c.idd.suffixes && c.idd.suffixes.length > 0 ? c.idd.suffixes[0] : '') : 'None';
      const tld = c.tld ? c.tld.join(', ') : 'None';
      
      // Fallback for flag URL since this specific API uses emoji flags instead of URLs, 
      // we can construct a reliable flag CDN URL using the ISO alpha-2 code
      const flagUrl = c.cca2 ? `https://flagcdn.com/w320/${c.cca2.toLowerCase()}.png` : 'None';
      
      const lat = c.latlng && c.latlng.length === 2 ? c.latlng[0] : 0;
      const lng = c.latlng && c.latlng.length === 2 ? c.latlng[1] : 0;

      return {
        country_name: c.name.common || 'Unknown',
        official_name: c.name.official || 'Unknown',
        country_code: c.cca2 || 'Unknown',
        iso_alpha3: c.cca3 || 'Unknown',
        iso_numeric: c.ccn3 || 'Unknown',
        capital: capital,
        continent: c.region || 'Unknown',
        subregion: c.subregion || 'Unknown',
        population: c.population || 0, // This dataset omits population, defaulting to 0
        area: c.area || 0,
        currency: currencyName,
        currency_code: currencyCode,
        language: language,
        timezones: timezones,
        calling_code: callingCode,
        tld: tld,
        flag_url: flagUrl,
        latitude: lat,
        longitude: lng
      };
    });

    console.log('Pushing to Supabase...');
    
    // Upsert batches to avoid payload limits
    const batchSize = 50;
    for (let i = 0; i < formattedData.length; i += batchSize) {
      const batch = formattedData.slice(i, i + batchSize);
      const { error } = await supabase
        .from('countries')
        .upsert(batch, { onConflict: 'country_code' });
        
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error.message);
      } else {
        console.log(`Successfully inserted batch ${i / batchSize + 1} (${batch.length} records)`);
      }
    }
    
    console.log('Seeding complete!');
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

seedDatabase();
