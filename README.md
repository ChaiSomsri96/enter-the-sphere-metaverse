# The Sphere Rest API

Backend for the sphere.

## Install

Set up Node v14.13.1

You can select node version with nvm: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

```bash
npm install
cp env.example .env
```

### Set up wallet

Create new wallet with electron cash slp edition, edit `.env` to reflect these.

### Set up database

Install postgres, create new database and user with superuser privileges

```bash
sudo -u postgres psql
create user username with encrypted password 'password';
alter role username superuser;
create database ets_db;
grant all privileges on database ets_db to username;
```

Then once this is set up, and the modifications made to `.env` (connString) just run

```bash
npm run db:migrate
```

You can do this any time to wipe db and restart fresh:

```bash
npm run db:reset
```

You may also want to install pgadmin4 for debugging.

#### For production

Use environment variables to configure connection to postgres: 

  -  POSTGRES_USER
  -  POSTGRES_PASSWORD
  -  POSTGRES_HOST
  -  POSTGRES_DB

### Documentation

Documentation on all api routes can be found by accessing `/doc` on the http server. These are automatically detected by swagger-autogen and additional information for routes are given inside the controllers (such as in `./src/auth/controllers/forgot-password.controller.js`).

You can find documentation on how to add these tags [here](https://www.npmjs.com/package/swagger-autogen). Additionally, more datatypes and configuration can be defined inside `src/swagger.js`. To generate documentation run:

```bash
npm run swagger-autogen
```

Which will produce `src/swagger_output.json`. This may be done every time there is update to documentation or routes.

#### Deploy

To upload to staging server, make sure you have pushed to git and are on latest revision, then just type:

```bash
make deploy-staging
```

Or for production:

```bash
make deploy-prod
```

## Contributing

### Lint

Check linter doesn't have toooo many warnings :) can disable some if it isn't useful.

```bash
npm run lint
```

### Test

Run unit tests / add unit tests

```bash
npm run test
```

#### Code Coverage

To check code coverage of tests run

```bash
npm run test:coverage
```

#### Blockchain Tests

Tests using real bitcoin transactions on mainnet can be run as well. These may require some setup like populating with bch.

```bash
npm run test:bch
```



# TheSphere Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


### Deployment configs

apiURL and debug mode are enabled within `./src/env.js`
Do not commit changes this file on git unless you add a new env vars and do not apply changes on remove environments as well.

sample of this file

```
(function (window) {
  window.__env = window.__env || {};
  // API url
  window.__env.apiUrl = 'https://staging.enter-the-sphere.com/api/v1";
  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
}(this));
```

During deployment on staging/testing/production environment this file should exist on environment already.
