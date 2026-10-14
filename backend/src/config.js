const fs = require("fs");

const passwordSource = process.env.DATABASE_PASSWORD_FILE || process.env.DATABASE_PASSWORD;
const password = passwordSource && fs.existsSync(passwordSource)
  ? fs.readFileSync(passwordSource, "utf8").replace(/\r?\n$/, "")
  : passwordSource || null;

// Constants
module.exports = {
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password
  },
  port: process.env.PORT || 8080
  // if you're not using docker compose for local development, this will default to 8080
  // to prevent non-root permission problems with 80. Dockerfile is set to make this 80
  // because containers don't have that issue :)
};
