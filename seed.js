require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const countriesToInsert = [
  {
    country_name: 'Japan',
    country_code: 'JP',
    capital: 'Tokyo',
    continent: 'Asia',
    currency: 'Japanese Yen (JPY)',
    population: 125100000,
    language: 'Japanese'
  },
  {
    country_name: 'Brazil',
    country_code: 'BR',
    capital: 'Brasília',
    continent: 'South America',
    currency: 'Brazilian Real (BRL)',
    population: 214300000,
    language: 'Portuguese'
  },
  {
    country_name: 'Canada',
    country_code: 'CA',
    capital: 'Ottawa',
    continent: 'North America',
    currency: 'Canadian Dollar (CAD)',
    population: 38250000,
    language: 'English, French'
  },
  {
    country_name: 'Germany',
    country_code: 'DE',
    capital: 'Berlin',
    continent: 'Europe',
    currency: 'Euro (EUR)',
    population: 83200000,
    language: 'German'
  },
  {
    country_name: 'Australia',
    country_code: 'AU',
    capital: 'Canberra',
    continent: 'Oceania',
    currency: 'Australian Dollar (AUD)',
    population: 25690000,
    language: 'English'
  }
];

async function seedData() {
  console.log('Inserting sample countries...');
  const { data, error } = await supabase
    .from('countries')
    .insert(countriesToInsert)
    .select();

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Successfully inserted data:', data);
  }
}

seedData();
