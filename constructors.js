'use strict';

// constructors
function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData.display_name;
  this.latitude = locationData.lat;
  this.longitude = locationData.lon;
}

// function Weather(dailyData) {
//   console.log('dailyData: ', dailyData);
//   this.forecast = dailyData.summary;
//   this.time = new Date(dailyData.time * 1000).toString().slice(0,15);
//   // console.log('forecast: ', this.forecast);
// }

// function NewEvent(thisEventData) {
//   this.name = thisEventData.title;
//   this.event_date = thisEventData.start_time.slice(0, 10);
//   this.link = thisEventData.url;
//   this.summary = thisEventData.description;
// }

// function Movies(movieData) {
//   this.title = movieData.title;
//   this.released_on = movieData.release_date;
//   this.total_votes = movieData.vote_count;
//   this.average_votes = movieData.vote_average;
//   this.popularity = movieData.popularity;
//   this.image_url = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movieData.poster_path}`;
//   this.overview = movieData.overview;
// }

// function Yelp(yelpData) {
//   this.name = yelpData.name;
//   this.url = yelpData.url;
//   this.rating = yelpData.rating;
//   this.price = yelpData.price;
//   this.image_url = yelpData.image_url;
// }

// function Trails(trailData) {
//   this.name = trailData.name;
//   this.trail_url = trailData.url;
//   this.location = trailData.location;
//   this.length = trailData.length;
//   if (trailData.conditionDate.includes('1970-01-01')) {
//     this.condition_date = new Date().toString().slice(0,15);
//     this.condition_time = '12:00 AM';
//     this.conditions = 'Unknown';
//   } else {
//     this.condition_date = new Date(trailData.conditionDate).toString().slice(0,15);
//     this.condition_time = new Date(trailData.conditionDate).toLocaleDateString([], {hour: '2-digit', minute: '2-digit',}).slice(11);
//     this.conditions = `${trailData.conditionStatus} & ${trailData.conditionDetails}`;
//   }
//   this.stars = trailData.stars;
//   this.star_votes = trailData.starVotes;
//   this.summary = trailData.summary;
// }

// module.exports = (Location, Weather, NewEvent, Movies, Yelp, Trails);
module.exports = (Location);
