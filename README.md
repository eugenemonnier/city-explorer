
# City Explorer

**Author**: Eugene Monnier
**Version**: 1.0.0 

## Overview
The *City Explorer* project is a project to develop a backend server for a website that allows a user to request weather and event information by city.

## Getting Started
### Documentation
[Node JS Docs](https://nodejs.org/en/)

[NPM JS Docs](https://docs.npmjs.com/)

[Express JS Docs](http://expressjs.com/en/4x/api.html)

[Dotenv Docs](https://www.npmjs.com/package/dotenv)

### Configuration
 - `data` directory - with `geo.json` and `darksky.json`.
 - `.env` - with your PORT. Make sure this file is in your `.gitignore`.
 - `.gitignore` - with standard NodeJS configurations.
 - `.eslintrc.json` - with Code 301 course standards for the linter
 - `package.json` - with all dependencies and any associated details related to configuration. Dependencies required: 
     - express
     - cors
     - dotenv
    - Note that the `package-lock.json` file is automatically created when dependencies are installed and ensures that future installations of the project use the same versions of the dependencies.

## Architecture
This backend utilizes the JavaScript language including the following libraries:
 - Node JS
 - Express JS
 - Dotenv
 - cors

## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples: -->

01-14-2020 11:30 - Application now has a fully-functional express server, with a GET route for the location resource. Returns location data for Lynwood for any search request.

## Credits and Collaborations
<!-- <Give credit (and a link) to other people or resources that helped you build this application. -->
Ken Dickey
 

## Feature Request 1: *Locations*

As a user of City Explorer, I want to enter the name of a location so that I can see data about the area of interest to me.

### Description

**Given** that a user enters a valid location in the input

**When** the user click the "Explore!" button

**Then** the map will be populated with the location centered on the latititude and longitude of the search query

Endpoint:
`/location`
Example Response:
 ```
    {   
"search_query": "seattle",
  "formatted_query": "Seattle, WA, USA",
  "latitude": "47.606210",
  "longitude": "-122.332071"
	}
```

 ### Features
 

 - [x] Create a route with a method of `get` and a path of `/location`. The route callback should invoke a function to convert the search query to a latitude and longitude. The function should use the provided JSON data.
 
 - [x] A constructor function will ensure that each object is created
       according to the same format when your server receives the
       external data. Ensure your code base uses a constructor function
       for this resource.
 - [x] Return an object which contains the necessary information for
       correct client rendering. See the sample response.
 - [x] Deploy your updated express server to Heroku.
 - [x] Confirm that your route is responding as expected by entering
       your deployed backend URL on the City Explorer app's welcome
       page. Then search for a location. You should see the map, but not
       any other data yet.

### Time Estimate
```
Estimate of time needed to complete: 1 hour

Start time: 10:30

Finish time: 11:30

Actual time needed to complete: 1 hour
```

## Feature Request 2: *Weather*

As a user of City Explorer, I want to request current weather information so that I can learn more about the typical weather patterns in the location I had entered.

### Description

**Given**  that a user enters a valid location in the input

**When**  the user clicks the "Explore!" button

**Then**  the weather forecast for the upcoming eight days will be displayed in the browser

Endpoint:  
`/weather`

Example Response:

```
[
  {
    "forecast": "Partly cloudy until afternoon.",
    "time": "Mon Jan 01 2001"
  },
  {
    "forecast": "Mostly cloudy in the morning.",
    "time": "Tue Jan 02 2001"
  },
  ...
]
```
### Features

 - [ ] Create a route with a method of  `get`  and a path of 
       `/weather`. The callback should use the provided JSON data.
       
 - [ ] A constructor function will ensure that each object is created
       according to the same format when the server receives data.
       Ensure your code base uses a constructor function for this
       resource.
       
 - [ ] Using each weather object of the result, return an array of
       objects for each day of the response which contains the necessary
       information for correct client rendering. See the sample
       response.
       
 - [ ] Deploy your updated server code to Heroku.
 
 - [ ] Confirm that your route is responding as expected by entering
       your deployed backend URL on the City Explorer app's welcome
       page. Then search for a location. You should see the map, and now
       weather data.

### Time Estimate 
```
Estimate of time needed to complete: 2 hours

Start time: 12:00

Finish time: 18:00

Actual time needed to complete: 2.5 hours 
```

## Feature Request 3: *Errors*
As a user, I want clear messages if something goes wrong so I know if I need to make any changes or try again in a different manner.

### Description

**Given**  that a user does not enter a valid location in the input

**When**  the user clicks the "Explore!" button

**Then**  the user will receive an error message on the page and the data will not be rendered properly

Endpoints:  
`/location`,  `/weather`

Example Response:

```
{
  status: 500,
  responseText: "Sorry, something went wrong",
  ...
}
```

### Features

 - [ ] Create a function to handle errors from any API call.

 - [ ] Send a status of 500 and an error message to the client.

 - [ ] Deploy your updated sever code to Heroku.

 - [ ] Confirm that your route is responding as expected by entering
       your deployed backend URL on the City Explorer app's welcome
       page. Then search for an invalid location. The network inspector
       panel should show a 500 for the response to the AJAX query.

### Time Estimate 
```
Estimate of time needed to complete: 1 hour

Start time: 

Finish time: 

Actual time needed to complete: 
```

## Feature Request 4: *Data Formatting*
As a user, I want the application to provide properly formatted data so that I can view similar sata for any location I choose.

### Description

**Given** that a user enters a valid location in the input

**When** the user clicks the "Explore!" button

**Then** the data will be rendered in the same format every time

### Features

- [ ] Refactor your getWeather callback to use .map and send the resulting array as your response to the client. Continue to use .map for the remainder of labs 7, 8, and 9.

- [ ] Redeploy your application.

### Time Estimate 
```
Estimate of time needed to complete: 1 hour

Start time: 

Finish time: 

Actual time needed to complete: 
```