const connectionString = 'postgres://localhost:5432/dummy';
const file = require('fs');

const knex = require('knex')({
  client: 'pg',
  connection: {
    user: 'Mitch',
    database: 'deckbuilder',
    port: 5432,
    host: 'localhost',
  },
  debug: false
});

let cards = [];
file.readFile('cards.json', 'utf8', function read(err, data) {
  if (err) throw err;
  console.log('Data read from file');
  cards = JSON.parse(data);
});

const schemaCreation = function() {

  return knex.schema.dropTableIfExists('cards')
    .then(function() {
      return knex.schema.createTable('cards', function(table){
        table.json('data').nullable();
      });
    });
};

const inserts = function() {
  const insertPromises = [];
  cards.forEach(function(card) {
    insertPromises.push(knex('cards')
      .insert({data: JSON.stringify(card)})
    );
  });
  return Promise.all(insertPromises);
};

schemaCreation()
  .then(function() {
    console.log('Table created');
  })
  .then(inserts)
  .then(function() {
    console.log('Inserts done');
  })
  .then(function() {
    process.exit(0); 
  })
  .catch(function(error){
    console.log(error);
  });


