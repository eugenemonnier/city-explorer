DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS weather;
DROP TABLE IF EXISTS events;


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
    link VARCHAR(255),
    event_name VARCHAR(255),
    summary VARCHAR(255),
    event_date DATE
);	