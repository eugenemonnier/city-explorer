DROP TABLE IF EXISTS locations;


  CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude DECIMAL(12,8),
    longitude DECIMAL(12,8),
    weather_url VARCHAR(255),
    event_url VARCHAR(255),
    movie_url VARCHAR(255),
    yelp_search VARCHAR(255),
    trails_url VARCHAR(255),
    location_data JSON,
    forecast JSON,
    event_data JSON,
    movie_data JSON,
    yelp_data JSON,
    trails_data JSON
);
