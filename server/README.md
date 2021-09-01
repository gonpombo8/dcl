# Users Tracker

This is a simple server to track friendships of users and extract some analytics from them. It's implemented with ExpressJS + Typescript + pg-promise for persistance.

## Running the server

NodeJS is needed to compile & run the server. It has been tested with version 14.17.1, though other versions may work too.

Once NodeJS is installed, remember to run `npm install` in the `server` folder.

### Running the database

This server needs a PostgreSQL database running to work. It has been tested with Postgres 12.

The easiest way to run the database is to use docker. If you have docker installed, you can run `npm run local-db` and it should start a docker container with a Postgres that allows access with the credentials provided in [src/config/db.ts](src/config/db.ts).

To check that the container was started correctly, you can run `docker ps`. You should see a container named "postgres".

### Starting the server

Once the database is running, `npm run start` can be run to start the server. It should automatically run the migrations and start the server, listening in port 8081.

To test that the server is running correctly, you can go to http://localhost:8081/status.

## Server API

The server currently has three services:
* GET `/status`: Returns server status.
* GET `/friendships`: Return the currently added friendships in the server.
* POST `/friendships/{address1}/{address2}`: Creates a friendship between address 1 and address 2. No need to provide any body in the request.

To create friendships for testing, you can use any tool that can perform a `POST`.

A Postman collection is provided in the [postman](postman) folder. You can import it to test the app more easily.

## Testing

Jest is used to write and run tests.

You can do `npm run test` to run the tests. Any file in the [test](test) folder that ends with `.spec.ts` will be considered for testing. If you need to add tests, you can add them following that convention.

Only unit tests infrastructure is provided. No need to add integration testing.

**Note**: Prioritize implementation over testing. If you have little time, manual testing should be enough for this exercise.

## Migrations

Database Migrations are stored in the [src/migrations/scripts](src/migrations/scripts). [node-pg-migrate](https://github.com/salsita/node-pg-migrate) is used for this purpose.

If there's a need to modify the database, migrations should be added to ensure that the data model can be replicated everywhere.

### Creating a migration

You can run `npm run migrate create {MIGRATION_NAME}` to create a migration. It should be automatically added to the correct folder.

### Running migrations

Migrations are run automatically when the server is started. If you need to run them manually, you can run:

`DATABASE_URL=postgres://postgres:12345678@localhost:5432/users_tracker npm run migrate up`

Replacing `DATABASE_URL` with a valid url if the credentials are different than the default.

### Reverting migrations

`DATABASE_URL=postgres://postgres:12345678@localhost:5432/users_tracker npm run migrate down`
