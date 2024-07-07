/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://interviewbot-db_owner:aAxMuEbWU04I@ep-shy-union-a50qlkys.us-east-2.aws.neon.tech/interviewbot-db?sslmode=require",
  },
};
