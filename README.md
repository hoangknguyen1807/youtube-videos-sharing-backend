<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Database setup
1. Create a PostgresSQL database named `youtube-videos-sharing`
2. Run the 2nd migration script below


##### Run migration
```shell script
# create migration
npm run typeorm:create-migration create-user-table
```

```shell script
# generate migration
npm run typeorm:run-migrations
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
