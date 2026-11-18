require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanupManualCountries() {
  console.log('Removing all imported countries...');
  const { data, error } = await supabase
    .from('countries')
    .delete()
    .not('id', 'is', null)
    .select('country_name');

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log(`Successfully deleted ${data.length} countries.`);
  }
}

cleanupManualCountries();
