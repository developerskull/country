const axios = require('axios');
axios.get('https://raw.githubusercontent.com/mledoze/countries/master/countries.json')
  .then(r => console.log(JSON.stringify(r.data[0], null, 2)))
  .catch(console.error);
