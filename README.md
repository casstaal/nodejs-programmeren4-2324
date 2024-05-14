# Nodejs Programmeren 4 Share-a-meal Express server

This project is a share-a-meal application designed to make meal sharing among users possible. It includes functionalities for user management, such as creating, reading, updating and deleting user accounts. Users can log into the application with their emailaddress and password and create meals. 
The application is hosted on Microsoft Azure and utilizes an online database for storage.

If you want to access the server online, navigate to the URL: https://share-a-meal-programmeren-4.azurewebsites.net/api/user

If you want to run the server locally, please follow the steps below. (Installing, Running, Run the tests, Run database)

## Installing

To install, run `npm install`.

## Running

To run the server in your local development environment, type `npm start`. 
(Remember that your local database should be running.)

## Run the tests

To run the tests, type `npm test`.
To access the tests, you can navigate to the test folder where all the test for each use case are stored.

## Run database

This repository includes a share-a-meal.sql file. If you intend to run the server locally, you'll need to set up the database accordingly. To install the database locally, follow these steps:

1. Open the command prompt (cmd).
2. Navigate to the directory where the share-a-meal.sql file is located
3. Enter the command "mysql -u root" in the command prompt.
4. Once logged in to MySQL, execute the command "source share-a-meal.sql".
5. If the installation is successful, you should have a local database running on your device.
6. To verify, type "use share-a-meal" and then execute the query "SELECT * FROM user;".
7. If the database is running correctly, you should see five users displayed.
8. If you encounter any issues, ensure that MySQL is installed. If not, run npm install to install the necessary dependencies, and then try again.

## Endpoints

Within the routes files in the routes folder, you'll discover the endpoints of which the server consist. Each endpoint serves a specific purpose, and for detailed insights into its functionality, you can navigate to the corrresponding controller method by pressing F12 at the end of the route.
To utilize these endpoints, you can use Postman. Simply create a new request in Postman and add the provided url above with the specific endpoint, for the online server. For the local server use localhost:3000 with the specific endpoint.

## Services

The files under the folder services are used for handling operations, such as creating, updating, deleting and reading data from the database. It interacts directly with the database layer to perform these so called CRUD operations.

## Controller

The files under the folder controller act as an interface between the requests coming from the clients and the service layer described above. It contains the route handlers for the endpoints stored in the routes files. When the an request is received, the controller validates the request, extracts necessary data, and calls the corresponding service function to process the request. Once the operation is completed, the controller sends and appropriate response back to the client.
