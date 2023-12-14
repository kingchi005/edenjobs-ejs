# EdenJobs Website

## Quickstart

To quick start create a `.env` file at the root of the project and add the following to this file

```env
DATABASE_URL=file:./db.sqlite
HASH_SECRET=# any secrete phrase
```

Then run the following command one after the other

```bash
npm run db:sync
npm run db:seed
npm run dev
```

This will spin up a developement server at `localhost:500`. Visit the url to view the website

## Contribution

To contribute to the project you will need to have `nodemon` installed globally in your system for development purposes.

Run the following command in two different terminals to start a development server for contributing

```bash
npm run css
# open another terminal and run
nodemon
```

Then add your contributions to the front end through the `./views` folder

## Dependencies

- Nodejs v14^
- Nodemon
