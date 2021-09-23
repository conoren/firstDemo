module.exports = {
    HOST: "db-toth-aron-do-user-7298387-0.b.db.ondigitalocean.com",
    USER: "doadmin",
    PASSWORD: process.env.PGPW,
    DATABASE: "defaultdb",
    DIALECT: "postgres",
    PORT: 25060,
    SSLMODE = "require",

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };