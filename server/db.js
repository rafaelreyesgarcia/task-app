const { Pool } = require('pg');
// require('dotenv').config()
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  // default behavior of postgres is to use OS user as database user
  // PG environment variables can be used to define parameters for a session
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

module.exports = pool