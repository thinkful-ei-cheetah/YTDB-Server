# YTDB

IMDb for youtube channels. Search our db or Youtube's db for channels by name, topic or keyword. Rate and review them. Add your favorite channels to your dashboard.

+ [Live App](https://ytdb-client.jonathanlassen.now.sh/)
+ [Client Repo](https://github.com/thinkful-ei-cheetah/YTDB-Client)
+ [Server Repo](https://github.com/thinkful-ei-cheetah/YTDB-Server)

## Set up

```
git clone https://github.com/thinkful-ei-cheetah/YTDB-Server.git
cd YTDB-Server
rm -rf .git && git init
npm install
mv example.env .env
Setup your credential in your enviroment file
create your db: create db -U <username> ytdb
create your testdb: create db -U <username> ytdb-test
```
Edit the contents of the package.json to use NEW-PROJECT-NAME instead of "name": "ytdb",

`This api requires a valid Youtube API key`

## Routes

```
/api/register
/api/reviews
/api/channels
/api/user
/api/rating
/api/favorite
```

### Endpoint Response Examples:

/api/channels/search/:search_term/:ytapi
```
{
  data: [
    {
      description: "Hey There! The name's Lachlan, and welcome...",
      rating_count: 10,
      rating_total: 2,
      thumbnail: "https://yt3.ggpht.com/-SWZwLtHEz08/AAAAAAAAAAI/AAAAAAAAAAA/eQMhBKvqjQ0/s240-c-k-no-mo-rj-c0xffffff/photo.jpg",
      title: "Lachlan",
      yt_id: "UCh7EqOZt7EvO2osuKbIlpGg"
    },
    {...},
    {...},
    {...},
    {...},
    ...
  ]
}
```
/api/channels/:id
```
{
  data: [
    comment_count: "0",
    date_updated: "2019-07-18T18:52:31.083Z",
    description: "Experienced and seasoned player in...",
    id: 1,
    keywords: [
      "mordhau", 
      "alpha", 
      "beta", 
      "pre-release", 
      ...
    ],
    rating_count: 3,
    rating_total: 11,
    subscriber_count: "25387",
    thumbnail: "https://yt3.ggpht.com/-JHtfSa8v6vI/AAAAAAAAAAI/AAAAAAAAAAA/cLuFqmBYCLI/s88-c-k-no-mo-rj-c0xffffff/photo.jpg",
    title: "Trix",
    topics: [
      0: "Gaming",
      1: "Action game",
      2: "Role-playing video game"
    ],
    total_videos: "58",
    view_count: "3014061",
    yt_id: "UCncxKtsdgI9ruYkmYbNWh6Q"
  ]
}
```
/api/reviews/:id
```
{
  {
    channel_id: 1,
    date_created: "2019-07-16T16:11:57.305Z",
    date_updated: "2019-07-16T16:11:57.305Z",
    id: 1,
    text: "USER 1 (admin) made a review for CHANNEL 1 (Trix)",
    total_dislikes: 0,
    total_likes: 1,
    user_id: 1,
    username: "admin"
  },
  {...},
  {...},
  {...}
}
```

## Scripts

Start the application:
```
 npm start
```
---
Start nodemon for the application:
```
 npm run dev
```
Run the test:
```
npm test
```
---
Run the migrations up:
```
npm run migrate
```
Run the migrations down
```
npm run migrate -- 0
```
---
Run the test migrations up:
```
MIGRATION_DB_NAME=ytdb-test npm run migrate
```
Run the test migrations down
```
MIGRATION_DB_NAME=ytdb-test npm run migrate -- 0
```
---
Run the production migrations up:
```
npm run migrate-production
```
Run the migrate-production down
```
npm run migrate-production -- 0
```

## Seeds

Add:


```
// from the terminal
psql -U <username> -d ytdb -f ./path-to-YTDB-Server/seeds/seed.tables.sql

// from within the db
\i ./path-to-YTDB-Server/seeds/seed.tables.sql
```
---
Remove:
```
// from the terminal
psql -U <username> -d ytdb -f ./path-to-YTDB-Server/seeds/trunc.tables.sql

// from within the db
\i ./path-to-YTDB-Server/seeds/trunc.tables.sql
```
`Test User:`
+ username: admin
+ password: pass

## Database Setup

For tests involving time to run properly, your Postgres database must be configured to run in the UTC timezone.
+ Locate the postgresql.conf file for your Postgres installation. +OS X, Homebrew: /usr/local/var/postgres/postgresql.conf
+ Uncomment the timezone line and set it to UTC as follows:
```
datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default' # Select the set of available time zone
```

## Built With

+ [Node.js](https://nodejs.org/en/) - engine
+ [Express](https://expressjs.com/) - framework
+ [PostgreSQL](https://www.postgresql.org/) - database

## Libraries (Node Modules)

+ Dependencies
  + [bcryptjs](https://www.npmjs.com/package/bcryptjs)
  + [cors](https://www.npmjs.com/package/cors)
  + [dotenv](https://www.npmjs.com/package/dotenv)
  + [express](https://www.npmjs.com/package/express)
  + [helmet](https://www.npmjs.com/package/helmet)
  + [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  + [knex](https://www.npmjs.com/package/knex)
  + [morgan](https://www.npmjs.com/package/morgan)
  + [node-fetch](https://www.npmjs.com/package/node-fetch)
  + [path](https://www.npmjs.com/package/path)
  + [pg](https://www.npmjs.com/package/pg)
  + [pg-escape](https://www.npmjs.com/package/pg-escape)
  + [utf8](https://www.npmjs.com/package/utf8)
  + [util](https://www.npmjs.com/package/util)
  + [xss](https://www.npmjs.com/package/xss)
---
+ Dev-Dependencies
  + [chai](https://www.npmjs.com/package/chai)
  + [mocha](https://www.npmjs.com/package/mocha)
  + [nodemon](https://www.npmjs.com/package/nodemon)
  + [postgrator-cli](https://www.npmjs.com/package/postgrator-cli)
  + [supertest](https://www.npmjs.com/package/supertest)

## Authors

| Name | Primary Role | Email | Github |
| ---- | ------------ | ----- | ------ |
| **Levi Paulk** | *Information Architect* | <levipaulk@gmail.com> | https://github.com/levipaulk |
| **Ben Tilghman** | *Project Manager* | <ben.tilghman@gmail.com> | https://github.com/RDanneskjold |
| **Jonathan Lassen** | *User Interface Designer* | <jonathan.lassen@gmail.com> | https://github.com/jonathanlassen |
| **Rahim Morgan** | *Site Production Lead* | <rahbye1@gmail.com> | https://github.com/rahmor |
| **Mike Jung** | *Usability Lead* | <kpnba90@gmail.com> | https://github.com/mikejung90 |