# HS Deckbuilder Backend

## Getting started

Run:

`node utils/cards_parser.js` to get your card data into utils/cards.json
  (Note you may need to update the endpoint to get newer card lists!)
  https://api.hearthstonejson.com/v1/25770/enUS/cards.collectible.json
  is current as of 8/9/18 but you will have to replace the '25770' part
  with the latest API endpoint number from https://api.hearthstonejson.com/v1/

`node utils/seed_cards.js` to seed your card data into postgres

*More to come*