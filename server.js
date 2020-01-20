'use strict';
// required dependencies
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const yelp = require('yelp-fusion');

// global variables
const app = express();
const PORT = process.env.PORT || 3001;
let lat = 0;
let lon = 0;
let location = {};
// allows server to talk to frontend
app.use(cors());

// modules
const Location = require('./constructors');
// const Weather = require('./constructors');
// const NewEvent = require('./constructors');
// const Movies = require('./constructors');
// const Yelp = require('./constructors');
// const Trails = require('./constructors');



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
          response.status(200).json(results.rows[0].location_data);
          location.latitude = results.rows[0].latitude;
          location.longitude = results.rows[0].longitude;
        } else {
          superagent.get(geoDataURL)
            .then(locData => {
              let geoDataResults  = locData.body[0];
              location = new Location(city, geoDataResults);
              lat = location.latitude;
              lon = location.longitude;
              let sql = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude, location_data) VALUES ($1, $2, $3, $4, $5 );';
              let safeValues = [location.search_query, location.formatted_query, location.latitude, location.longitude, JSON.stringify(location)];
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
    console.log('here');
    let key = process.env.DARK_SKY_API_KEY;
    const weatherDataURL = `https://api.darksky.net/forecast/${key}/${lat},${lon}`;
    console.log(weatherDataURL);
    let firstSql = 'SELECT * FROM locations WHERE weather_url=$1;';
    let safeSqlValue = [weatherDataURL];
    client.query(firstSql,safeSqlValue)
      .then (results => {
        if (results.rows.length > 0) {
          response.status(200).json(results.rows[0].forecast);
        } else {
          superagent.get(weatherDataURL)
            .then(weatherData => {
              let localWeather = weatherData.body.daily.data.map(dailyData=> {
                return new Weather(dailyData);
              });
              let sql = 'UPDATE locations SET forecast = $1, weather_url = $2 WHERE search_query = $3;';
              let safeValues = [JSON.stringify(localWeather), weatherDataURL, request.query.search_query];
              client.query(sql, safeValues);
              response.status(200).send(localWeather);
            });
        }
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
    let firstSql = 'SELECT * FROM locations WHERE event_url=$1;';
    let safeSqlValue = [eventDataURL];
    client.query(firstSql,safeSqlValue)
      .then (results => {
        results.rows.length > 0 ? response.status(200).json(results.rows[0].event_data)
          : superagent.get(eventDataURL)
            .then(eventData => {
              let eventMassData = JSON.parse(eventData.text);
              let localEvent = eventMassData.events.event.map(thisEventData => {
                return new NewEvent(thisEventData);
              });
              let sql = 'UPDATE locations SET event_data = $3, event_url = $2 WHERE search_query = $1;';
              let safeValues = [request.query.search_query, eventDataURL, JSON.stringify(localEvent)];
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
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${request.query.search_query}&sort_by=popularity.desc&include_adult=false`;
    let firstSql = 'SELECT * FROM locations WHERE movie_url=$1;';
    let safeSqlValue = [url];
    let sql = 'UPDATE locations SET movie_data = $3, movie_url = $2 WHERE search_query = $1;';

    clientQuery(request, response, firstSql, safeSqlValue, url, Movies, sql);
  }
  catch(error) {
    errorHandler('Robert messed up: ', error, request, response);
  }
});



app.get('/yelp', (request, response) => {
  try {
    let key = process.env.YELP_API_KEY;
    const yelpClinet = yelp.client(key);
    const yelpSearch = {
      term: 'restaurant',
      location: request.query.search_query,
    };
    let firstSql = 'SELECT * FROM locations WHERE yelp_search =$1;';
    let safeSqlValue = [yelpSearch.location];
    client.query(firstSql,safeSqlValue)
      .then (results => {
        results.rows.length > 0 ? response.status(200).json(results.rows[0].yelp_data)
          : yelpClinet.search(yelpSearch)
            .then(yelpData => {
              let yelpMassData = JSON.parse(yelpData.body);
              let yelpReview =  yelpMassData.businesses.map(thisYelpData => {
                return new Yelp(thisYelpData);
              });
              response.status(200).send(yelpReview);
              let sql = 'UPDATE locations SET yelp_data = $3, yelp_search = $2 WHERE search_query = $1;';
              let safeValues = [request.query.search_query, yelpSearch.location, JSON.stringify(yelpReview)];
              client.query(sql, safeValues);
            });
      });
  }
  catch(error) {
    errorHandler('Robert messed up: ', error, request, response);
  }
});

app.get('/trails', (request, response) => {
  try {
    let key = process.env.TRAIL_API_KEY;
    const trailsDataURL = `https://www.hikingproject.com/data/get-trails?lat=${location.latitude}&lon=${location.longitude}&maxDistance=10&key=${key}`;
    let firstSql = 'SELECT * FROM locations WHERE trails_url=$1;';
    let safeSqlValue = [trailsDataURL];
    client.query(firstSql,safeSqlValue)
      .then (results => {
        results.rows.length > 0 ? response.status(200).json(results.rows[0].trails_data)
          : superagent.get(trailsDataURL)
            .then(trailsData => {
              let trailsMassData = JSON.parse(trailsData.text);
              let trail =  trailsMassData.trails.map(trailData => {
                return new Trails(trailData);
              });
              response.status(200).send(trail);
              let sql = 'UPDATE locations SET trails_data = $3, trails_url = $2 WHERE search_query = $1;';
              let safeValues = [request.query.search_query, trailsDataURL, JSON.stringify(trail)];
              client.query(sql, safeValues);
            });
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

//functions
const clientQuery = ((request, response, firstSql,safeSqlValue,url,constructor,sql) => {
  client.query(firstSql,safeSqlValue)
    .then (results => {
      results.rows.length > 0 ? response.status(200).json(results.rows[0].movie_data)
        : superagentGet(request,response,url,constructor,sql);
    });
});

const superagentGet = ((request, response,url,constructor,sql) => {
  superagent.get(url)
    .then(data => {
      let massData = JSON.parse(data.text);
      let instance =  massData.results.map(mappedData => {
        return new constructor(mappedData);
      });
      response.status(200).send(instance);
      storeSQL(request, url, instance, sql);
    });
});

const storeSQL = ((request, url, instance, sql) => {
  let safeValues = [request.query.search_query, url, JSON.stringify(instance)];
  client.query(sql, safeValues);
});

// constructors
// function Location(city, locationData) {
//   this.search_query = city;
//   this.formatted_query = locationData.display_name;
//   this.latitude = locationData.lat;
//   this.longitude = locationData.lon;
// }

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

function Movies(movieData) {
  this.title = movieData.title;
  this.released_on = movieData.release_date;
  this.total_votes = movieData.vote_count;
  this.average_votes = movieData.vote_average;
  this.popularity = movieData.popularity;
  this.image_url = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movieData.poster_path}`;
  this.overview = movieData.overview;
}

function Yelp(yelpData) {
  this.name = yelpData.name;
  this.url = yelpData.url;
  this.rating = yelpData.rating;
  this.price = yelpData.price;
  this.image_url = yelpData.image_url;
}

function Trails(trailData) {
  this.name = trailData.name;
  this.trail_url = trailData.url;
  this.location = trailData.location;
  this.length = trailData.length;
  if (trailData.conditionDate.includes('1970-01-01')) {
    this.condition_date = new Date().toString().slice(0,15);
    this.condition_time = '12:00 AM';
    this.conditions = 'Unknown';
  } else {
    this.condition_date = new Date(trailData.conditionDate).toString().slice(0,15);
    this.condition_time = new Date(trailData.conditionDate).toLocaleDateString([], {hour: '2-digit', minute: '2-digit',}).slice(11);
    this.conditions = `${trailData.conditionStatus} & ${trailData.conditionDetails}`;
  }
  this.stars = trailData.stars;
  this.star_votes = trailData.starVotes;
  this.summary = trailData.summary;
}

//error handler
function errorHandler(string,request,response){
  response.status(500).send(string);
}

// turn it on
client.connect()
  .then( () => {
    app.listen(PORT, () => {
    });
  })
  .catch(err => {
    throw `PG Startup Error: ${err.message}`;
  });
