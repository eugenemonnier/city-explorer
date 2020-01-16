DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS weather;
DROP TABLE IF EXISTS events;


  CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude FLOAT(8),
    longitude FLOAT(8)
);

  CREATE TABLE weather (
    id SERIAL PRIMARY KEY,
    forecast VARCHAR(255),
    weather_time DATE
);	
	
  CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    link VARCHAR(255),
    event_name VARCHAR(255),
    summary VARCHAR(255),
    event_date DATE
);	