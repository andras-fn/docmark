export default {
  schema: "./src/db/schemas/*",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URI,
  },
};
