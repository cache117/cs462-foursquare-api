# Multi-Tenanted APIs and OAuth Lab

Simple node server to interact with Foursquare's API.

To get this working, first create file `config/default.json`. It should have the following structure:

    {
      "foursquare": {
        "secrets": {
          "clientId": "CLIENT_ID",
          "clientSecret": "CLIENT_SECRET",
          "redirectUrl": "http://localhost:3000/callback"
        }
      }
    }

