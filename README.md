
# City Explorer

  

A project to develop a backend server for a website that allows a user to request weather and event information by city.
 

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
 

 - [ ] Create a route with a method of `get` and a path of `/location`. The route callback should invoke a function to convert the search query to a latitude and longitude. The function should use the provided JSON data.
 
 - [ ] A constructor function will ensure that each object is created
       according to the same format when your server receives the
       external data. Ensure your code base uses a constructor function
       for this resource.
 - [ ] Return an object which contains the necessary information for
       correct client rendering. See the sample response.
 - [ ] Deploy your updated express server to Heroku.
 - [ ] Confirm that your route is responding as expected by entering
       your deployed backend URL on the City Explorer app's welcome
       page. Then search for a location. You should see the map, but not
       any other data yet.

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
## Feature Request 3: *Errors*
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
