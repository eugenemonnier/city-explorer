'use strict';

// required libraries
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// allows server to talk to frontend
app.use(cors());

// routes
app.get('/location', (request, response) => {
  try {
    let city = request.query.city;
    const geoData = require('.data/geo.json');
    let geoDataResults  = geoData[0];
    let location = new Location(city, locationData);
    // search_query: city,
    // formatted_query: geoData[0].display_name,
    // latitude: geoData[0].lat,
    // longitude: geoData[0].lon
    response.status(200).send(location);
  }

  catch(error) {
    errorHandler('we messed up', response);
  }
});

function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData.display_name;
  this.latitude = locationData.lat;
  this.longitude = location.lon;
}

function errorHandler(string,response){
  response.status(500).send(string);
}

app.get('/JulyTalk', (request, response) => {
  response.redirect('https://www.youtube.com/watch?v=YWywb9i-z7Y');
});

app.get('*', (request,response) => {
  response.status(404).send('This route does not exist');
})

// turn it on
app.listen(PORT, () => {
  console.log(`listen on ${PORT}`);
});