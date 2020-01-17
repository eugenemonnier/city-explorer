'use strict';
// required dependencies
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

// global variables
const app = express();
const PORT = process.env.PORT || 3001;
let locations = {};
let weathers = {};
let location = {};
// allows server to talk to frontend
app.use(cors());

client.on('error', err => console.error(err));


// routes
// don't forget to...
app.get('/JulyTalk', (request, response) => {
  response.redirect('https://www.youtube.com/watch?v=YWywb9i-z7Y');
});

app.get('/location', (request, response) => {
  try {
    let city = request.query.city;
    let key = process.env.GEOCODE_API_KEY;
    const geoDataURL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
    let firstSql = 'SELECT * FROM locations WHERE search_query=$1;';
    let safeSqlValue = [city];
    client.query(firstSql,safeSqlValue)
      .then (results => {
        results.rows.length > 0 ? response.send(results.rows[0])
          : superagent.get(geoDataURL)
            .then(locData => {
              let geoDataResults  = locData.body[0];
              location = new Location(city, geoDataResults);
              locations[geoDataURL] = location;
              let sql = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
              let safeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];
              client.query(sql, safeValues);
              response.status(200).send(location);
            });
      });
  }
  catch(error) {
    errorHandler('Robert messed up: ', error, request, response);
  }
});

app.get('/weather', (request, response) => {
  try {
    let key = process.env.DARK_SKY_API_KEY;
    const weatherDataURL = `https://api.darksky.net/forecast/${key}/${location.latitude},${location.longitude}`;
    weathers[weatherDataURL] ? response.send(weathers[weatherDataURL]) :
      superagent.get(weatherDataURL)
        .then(weatherData => {
          let localWeather = weatherData.body.daily.data.map(dailyData=> {
            return new Weather(dailyData);
          });
          weathers[weatherDataURL] = localWeather;
          response.status(200).send(localWeather);
        });
  }
  catch(error) {
    errorHandler('Robert messed up: ', error, request, response);
  }
});

app.get('/events', (request, response) => {
  try {
    let key = process.env.EVENTFUL_API_KEY;
    const eventDataURL = `http://api.eventful.com/json/events/search?location=${location.search_query}&date=Today&sort_order=date&sort_direction=descending&app_key=${key}`;
    superagent.get(eventDataURL)
      .then(eventData => {
        let eventMassData = JSON.parse(eventData.text);
        let localEvent = eventMassData.events.event.map(thisEventData => {
          return new NewEvent(thisEventData);
        });
        response.status(200).send(localEvent);
      });
  }
  catch(error) {
    errorHandler('Robert messed up: ', error, request, response);
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

function Weather(dailyData) {
  this.forecast = dailyData.summary;
  this.time = new Date(dailyData.time * 1000).toString().slice(0,15);
}

function NewEvent(thisEventData) {
  this.name = thisEventData.title;
  this.event_date = thisEventData.start_time.slice(0, 10);
  this.link = thisEventData.url;
  this.summary = thisEventData.description;
}

//error handler
function errorHandler(string,request,response){
  response.status(500).send(string);
}

// turn it on
client.connect()
  .then( () => {
    app.listen(PORT, () => {
      console.log('Server up on', PORT);
    });
  })
  .catch(err => {
    throw `PG Startup Error: ${err.message}`;
  });
