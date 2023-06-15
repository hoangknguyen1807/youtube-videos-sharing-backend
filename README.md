## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

1. Install Redis server on localhost, port 6379. See https://redis.io/docs/getting-started/installation/install-redis-on-linux
2. Install dependencies

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
