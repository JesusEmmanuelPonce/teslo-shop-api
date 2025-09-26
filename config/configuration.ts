
export default () => ({
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
});
