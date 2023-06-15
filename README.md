<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## Folder structure

```
.
├── src
│   ├── config
│   ├── databases
│   ├── core
│   │   ├── entities
│   │   ├── exceptions
│   │   ├── http
│   │   │   ├── controllers
│   │   │   └── guards
│   │   ├── repositories
│   │   │   ├── criterias
│   │   │   └── eloquents
│   │   ├── requests
│   │   ├── services
│   │   ├── tests
│   │   └── transformers
│   ├── mails
│   │   ├── adapters
│   │   ├── constants
│   │   ├── interfaces
│   │   ├── mails
│   │   └── services
│   └── users                   -> Module user
│       ├── entities            -> Contains entities
│       ├── enums               -> Contains enums
│       ├── http
│       │   ├── controllers     -> Contains controllers
│       │   ├── guards          -> Contains guards
│       │   ├── midlewares      -> Contains midlewares
│       │   └── requests        -> Contains request
│       ├── mails               -> Contains emails
│       ├── repositories        -> Contains repositories
│       ├── resources           -> Contains information such as views, fonts, css...
│       │   └── mails           -> Contains views for email
│       ├── services            -> Contains services
│       ├── tests               -> Contains unit test, e2e test
│       └── transformers        -> Contains transformers
└── test

```

#### Version

> Postgres: 11

## Installation

```bash
$ npm install
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

## Typeorm Helper

##### Make migration
```shell script
# create migration
npm run typeorm:create-migration create-user-table
```

```shell script
# generate migration
npm run typeorm:run-migrations
```

