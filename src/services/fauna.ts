import { Client } from 'faunadb';

const fauna = new Client({
    secret: process.env.FAUNADB_KEY,
    domain: 'db.us.fauna.com',
    scheme: 'https',
});

export default fauna;
