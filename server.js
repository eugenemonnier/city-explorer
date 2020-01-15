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

// don't forget to...
app.get('/JulyTalk', (request, response) => {
  response.redirect('https://www.youtube.com/watch?v=YWywb9i-z7Y');
});

app.get('/location', (request, response) => {
  try {
    let city = request.query.city;
    const geoData = require('./data/geo.json');
    let geoDataResults  = geoData[0];
    let locations = new Location(city, geoDataResults);
    response.status(200).send(locations);
  }

  catch(error) {
    errorHandler('we messed up', request, response);
  }
});

app.get('/weather', (request, response) => {
  try {
    const weatherData = require('./data/darksky.json');
    const localWeather  = weatherData.daily.data.map(dailyData => {
      return new Weather(dailyData);
    });
    response.status(200).send(localWeather);
  }
  catch(error) {
    errorHandler('we messed up', request, response);
  }
});

// 404 route
app.get('*', (request,response) => {
  response.status(404).send(`<p style="margin: 20px; font-size: 60px; font-weight: bolder">404 Error</p><p style="margin-left: 20px; font-size: 30px">The requested URL "${request.url}" was not found on this server.</p>`);
});

// constructors 
function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData.display_name;
  this.latitude = locationData.lat;
  this.longitude = locationData.lon;
}

function Weather(dayData) {
  this.forecast = dayData.summary;
  this.time = new Date(dayData.time * 1000).toString().slice(0,15);
}

//error handler
function errorHandler(string,request,response){
  response.status(500).send(string);
}

// turn it on
app.listen(PORT, () => {
  console.log(`listen on ${PORT}`);
});
