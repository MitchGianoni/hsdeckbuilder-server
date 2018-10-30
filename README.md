# HS Deckbuilder Backend

## Getting started

To setup database simply run:

`node utils/cards_parser.js` 
  to get your card data into utils/cards.json
  (Note you may need to update the endpoint to get newer card lists!)
  https://api.hearthstonejson.com/v1/25770/enUS/cards.collectible.json
  is current as of 8/9/18 but you will have to replace the '25770' part
  with the latest API endpoint number from https://api.hearthstonejson.com/v1/

`node utils/schema.js` 
  to set up tables for cards, decks and cards_decks, and seed your card data into postgres

## Live application

Heroku: https://hs-deckbuilder-mg.herokuapp.com/
Client Repo: https://github.com/MitchGianoni/hsdeckbuilder-client

## Routes

#### POST /api/users/

*This route to create a user*

Params:
* username: string
* password: string
* email: string

**Request**
```
{
  "username": string,
  "password": string,
  "email": string
}
```

**Response**

201 on success, 422 on error


#### POST /api/auth/

*This route is for logging in and retrieving auth token.*

#### POST /api/auth/refresh

*This route is for refreshing auth token.* 

#### GET /api/cards/random

*This route is for retrieving two random cards from the card database.*
*This route bypasses authentication.*

**Response**
```
[
    {
        "id": "GIL_677",
        "class": "ROGUE",
        "name": "Face Collector",
        "data": {
            "artist": "James Ryman",
            "attack": 2,
            "cardClass": "ROGUE",
            "collectible": true,
            "cost": 3,
            "dbfId": 47599,
            "elite": true,
            "flavor": "“I’ll trade you a Malfurion for an Anduin.”",
            "health": 2,
            "id": "GIL_677",
            "mechanics": [
                "BATTLECRY",
                "ECHO"
            ],
            "name": "Face Collector",
            "rarity": "LEGENDARY",
            "set": "GILNEAS",
            "text": "<b>Echo</b>\n<b>Battlecry:</b> Add a random <b>Legendary</b> minion to your hand.",
            "type": "MINION"
        }
    },
    {
        "id": "OG_325",
        "class": "HUNTER",
        "name": "Carrion Grub",
        "data": {
            "artist": "Kan Liu",
            "attack": 2,
            "cardClass": "HUNTER",
            "collectible": true,
            "cost": 3,
            "dbfId": 38985,
            "flavor": "Carrion, my wayward grub.",
            "health": 5,
            "id": "OG_325",
            "name": "Carrion Grub",
            "race": "BEAST",
            "rarity": "COMMON",
            "set": "OG",
            "type": "MINION"
        }
    }
]
```


### GET /api/cards/

*This route retrieves all cards from the database.*

**Response**
```
[
    {
        "id": "GIL_677",
        "class": "ROGUE",
        "name": "Face Collector",
        "data": {
            "artist": "James Ryman",
            "attack": 2,
            "cardClass": "ROGUE",
            "collectible": true,
            "cost": 3,
            "dbfId": 47599,
            "elite": true,
            "flavor": "“I’ll trade you a Malfurion for an Anduin.”",
            "health": 2,
            "id": "GIL_677",
            "mechanics": [
                "BATTLECRY",
                "ECHO"
            ],
            "name": "Face Collector",
            "rarity": "LEGENDARY",
            "set": "GILNEAS",
            "text": "<b>Echo</b>\n<b>Battlecry:</b> Add a random <b>Legendary</b> minion to your hand.",
            "type": "MINION"
        }
    },
    {
        "id": "OG_325",
        "class": "HUNTER",
        "name": "Carrion Grub",
        "data": {
            "artist": "Kan Liu",
            "attack": 2,
            "cardClass": "HUNTER",
            "collectible": true,
            "cost": 3,
            "dbfId": 38985,
            "flavor": "Carrion, my wayward grub.",
            "health": 5,
            "id": "OG_325",
            "name": "Carrion Grub",
            "race": "BEAST",
            "rarity": "COMMON",
            "set": "OG",
            "type": "MINION"
        }
    }
]
```

*Just a sample of the card data*

#### GET /api/cards/:id

*Get a specific card from the database by id.*
*ID is the same that the game uses. I.E. "GIL_677"*

**Response**
```
    {
        "id": "GIL_677",
        "class": "ROGUE",
        "name": "Face Collector",
        "data": {
            "artist": "James Ryman",
            "attack": 2,
            "cardClass": "ROGUE",
            "collectible": true,
            "cost": 3,
            "dbfId": 47599,
            "elite": true,
            "flavor": "“I’ll trade you a Malfurion for an Anduin.”",
            "health": 2,
            "id": "GIL_677",
            "mechanics": [
                "BATTLECRY",
                "ECHO"
            ],
            "name": "Face Collector",
            "rarity": "LEGENDARY",
            "set": "GILNEAS",
            "text": "<b>Echo</b>\n<b>Battlecry:</b> Add a random <b>Legendary</b> minion to your hand.",
            "type": "MINION"
        }
    }
```

#### GET /api/decks/

*This route retrieves all decks for the current logged in user.*

Params:
* user.id: string

**Request**
```
{
  "user_id": string
}
```

**Response**
```
[
    {
        "id": 36,
        "user_id": 2,
        "deckName": "Druid",
        "deckClass": "DRUID"
    },
    {
        "id": 38,
        "user_id": 2,
        "deckName": "Mage",
        "deckClass": "MAGE"
    },
    {
        "id": 39,
        "user_id": 2,
        "deckName": "Mage",
        "deckClass": "MAGE"
    },
    {
        "id": 43,
        "user_id": 2,
        "deckName": "f",
        "deckClass": "WARLOCK"
    }
]
```

#### POST /api/decks/

*This route is to create decks for the logged in user.*

Params:
* user.id: string
* deckClass: string
* deckName: string

**Request**
```
{
  "user_id": string,
  "deckClass": string,
  "deckName": string
}
```

**Response**

201 on success, 422 on error

#### DELETE /api/decks

*This route deletes a deck by id.*

Params:
* user.id: string
* deckId: string

**Request**
```
{
  "user_id": string,
  "deckId": string
}
```

**Response**

204 on success

#### GET /api/decks/:deck_id/cards

*Retrieves all cards in a deck by deck id.*

Params:
* user.id: string
* deckId: string

**Request**
```
{
  "user_id": string,
  "deckId": string
}
```

**Response**

201 on success

#### POST /api/decks/deck_id/cards

*Adds a card to a deck by deck id and card id.*

Params:
* user.id: string
* deckId: string
* cardId: string


**Request**
```
{
  "user_id": string,
  "deckId": string,
  "cardId": string
}
```

**Response**

201 on success

#### DELETE /api/decks/:deckId/cards/:cardId

*This route deletes a card from a deck by id.*

Params:
* user.id: string
* deckId: string
* cardId: string

**Request**
```
{
  "user_id": string,
  "deckId": string,
  "cardId": string
}
```

**Response**

204 on success