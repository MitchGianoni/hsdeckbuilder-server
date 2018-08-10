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
  return knex.schema.dropTableIfExists('cards_decks')
    .then(function() {
      return knex.schema.dropTableIfExists('decks');
    })
    .then(function() {
      return knex.schema.dropTableIfExists('cards');
    })
    .then(function() {
      return knex.schema.createTable('cards', function(table){
        table.string('id').unique().notNullable();
        table.string('class');
        table.json('data').nullable();
      });
    })
    .then(function() {
      return knex.schema.createTable('decks', function(table) {
        table.increments('id').primary();
        table.integer('user_id').references('users.id').onDelete('CASCADE');
        table.string('name').notNullable().defaultTo('');
        table.string('class').notNullable();
      });
    })
    .then(function() {
      return knex.schema.createTable('cards_decks', function(table) {
        table.integer('deck_id').notNullable().references('decks.id').onDelete('CASCADE');
        table.string('card_id').notNullable().references('cards.id');
      });
    });
};

const inserts = function() {
  const insertPromises = [];
  cards.forEach(function(card) {
    insertPromises.push(knex('cards')
      .insert({id: card.id, class: card.cardClass, data: JSON.stringify(card)})
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


