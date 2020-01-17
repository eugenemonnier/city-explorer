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
        if(results.rows.length > 0) {
          response.send(results.rows[0]);
          location.latitude = results.rows[0].latitude;
          location.longitude = results.rows[0].longitude;
        } else {
          superagent.get(geoDataURL)
            .then(locData => {
              let geoDataResults  = locData.body[0];
              location = new Location(city, geoDataResults);
              let sql = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
              let safeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude];
              client.query(sql, safeValues);
              response.status(200).send(location);
            });
        }
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
    let firstSql = 'SELECT * FROM weather WHERE latitude=$1 AND longitude=$2;';
    let safeSqlValue = [location.latitude, location.longitude];
    client.query(firstSql,safeSqlValue)
      .then (results => {
        results.rows.length > 0 ? response.status(200).json(results.rows[0].forecast)
          : superagent.get(weatherDataURL)
            .then(weatherData => {
              let localWeather = weatherData.body.daily.data.map(dailyData=> {
                return new Weather(dailyData);
              });
              let jsonWeather = JSON.stringify(localWeather);
              let sql = 'INSERT INTO weather (latitude , longitude, forecast) VALUES ($1, $2, $3);';
              let safeValues = [location.latitude, location.longitude, jsonWeather];
              client.query(sql, safeValues);
              response.status(200).send(localWeather);
            });
      });
  }
  catch(error) {
    errorHandler('Robert messed up: ', error, request, response);
  }
});

app.get('/events', (request, response) => {
  try {
    let key = process.env.EVENTFUL_API_KEY;
    const eventDataURL = `http://api.eventful.com/json/events/search?location=${request.query.search_query}&date=Today&sort_order=date&sort_direction=descending&app_key=${key}`;
    let firstSql = 'SELECT * FROM events WHERE city=$1;';
    let safeSqlValue = [request.query.search_query];
    client.query(firstSql,safeSqlValue)
      .then (results => {
        results.rows.length > 0 ? response.status(200).json(results.rows[0].event_data)
          : superagent.get(eventDataURL)
            .then(eventData => {
              let eventMassData = JSON.parse(eventData.text);
              let localEvent = eventMassData.events.event.map(thisEventData => {
                return new NewEvent(thisEventData);
              });
              let sql = 'INSERT INTO events (city, event_data) VALUES ($1, $2);';
              let safeValues = [request.query.search_query, JSON.stringify(localEvent)];
              client.query(sql, safeValues);
              response.status(200).send(localEvent);
            });
      });
  }
  catch(error) {
    errorHandler('Robert messed up: ', error, request, response);
  }
});

app.get('/movies', (request, response) => {
  try {
    let key = process.env.MOVIE_API_KEY;
    const movieDataURL = `https://api.themoviedb.org/3/search/multi?api_key=${key}&language=en-US&query=${request.query.search_query}&page=1&include_adult=false`;
    let firstSql = 'SELECT * FROM movies WHERE city=$1;';
    let safeSqlValue = [request.query.search_query];
    client.query(firstSql,safeSqlValue)
      .then (results => {
        results.rows.length > 0 ? response.status(200).json(results.rows[0].movie_data)
          : superagent.get(movieDataURL)
            .then(movieData => {
              let movieMassData = JSON.parse(movieData.text);
              let movie =  movieMassData.results.map(thisMovieData => {
                if (thisMovieData.media_type === 'movie') {
                  return new Movies(thisMovieData);
                }
              });
              response.status(200).send(movie);
              let sql = 'INSERT INTO movies (city, movie_data) VALUES ($1, $2);';
              let safeValues = [request.query.search_query, JSON.stringify(movie)];
              client.query(sql, safeValues);
            });
      });
  }
  catch(error) {
    errorHandler('Robert messed up: ', error, request, response);
  }
});

function Movies(movieData) {
  this.title = movieData.title;
  this.released_on = movieData.release_date;
  this.total_votes = movieData.vote_count;
  this.average_votes = movieData.vote_average;
  this.popularity = movieData.popularity;
  this.image_url = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movieData.poster_path}`;
  this.overview = movieData.overview;

  // p><span>{{ title }}</span> was relased on {{ released_on }}. Out of {{ total_votes }} total votes, {{title}} has an average vote of {{ average_votes }} and a popularity score of {{ popularity }}.</p>
  // <img src="{{ image_url }}">
  // <p>{{ overview }}</p>

}

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
