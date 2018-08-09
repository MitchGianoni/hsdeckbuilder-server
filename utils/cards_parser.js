const axios = require('axios');
const file = require('fs');

axios.get('https://api.hearthstonejson.com/v1/25770/enUS/cards.collectible.json')
  .then(response => {
    file.writeFile('cards.json', JSON.stringify(response.data, null, 2), (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  })
  .catch(error => {
    console.log(error);
  });