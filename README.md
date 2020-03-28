# Hacker news app

hacker-news-app is a MERN app that shows most recents post of Hacker News. It stores the posts deleted by the user and information retrieved from the api `http://hn.algolia.com/api/v1/search_by_date?query=nodejs` every 1 hour.

Once the post is deleted is not going to appear unless the recover route is called.

## Starting the App

Having [Docker](https://docs.docker.com/install/) installed, just run:

````
docker-compose build
docker-compose up
````
## Ports
The React.js app is going to be running at port 3000 of your [localhost](http://localhost:3000).

The Express app is listening at port 3001 .

The MongoDB is running and listening at port 27018 without RBAC.

## Routes

The Express app have some useful routes. By clicking the link on everyone of this README you are going to call them.

### State route
The [/state](http://localhost:3001/state) route returns the state of the app, including the API uptime.

### Recover route

The [/recover](http://localhost:3001/recover) route deletes all documents stored on the 'deleteds' collection. Is useful to 'refresh' the state of the app and have all the posts available again.

### Populate route

The [/populate](http://localhost:3001/populate) route populates the database with the last information from Hacker news.

## Test

The Express app have unit tests for the controllers and helpers. Go to /backend and run:
````
yarn test
````

Or if you use npm
````
npm run test
````
