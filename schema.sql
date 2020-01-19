DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS weather;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS yelp;
DROP TABLE IF EXISTS trails;


  CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude DECIMAL(12,8),
    longitude DECIMAL(12,8)
);

  CREATE TABLE weather (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(12,8),
    longitude DECIMAL(12,8),
    forecast JSON
);	
	
  CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255),
    event_data JSON
);	

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255),
    movie_data JSON
);

CREATE TABLE yelp (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255),
    yelp_data JSON
);

  CREATE TABLE trails (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(12,8),
    longitude DECIMAL(12,8),
    trails_data JSON
);	