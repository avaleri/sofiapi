const app = require('./app')
const dotenvConfig = require('dotenv').config();

if (dotenvConfig.error) {
    throw dotenvConfig.error
  }
  
  /*
  Parameters to configure in .env file:
  DB_HOST=
  DB_USER=
  DB_PASS=
  DB_NAME=
  APP_NAME=
  DB_CONTAINER_NAME=
  APP_PORT=
  */
  
  // Create connection to database
  var config = {
      userName: process.env.DB_USER, 
      password: process.env.DB_PASS, 
      server: process.env.DB_HOST,
      appName: process.env.APP_NAME,
      appPort: process.env.APP_PORT,
      options: {
          database: process.env.DB_NAME,
          encrypt: true,
          rowCollectionOnDone: true,
          rowCollectionOnRequestCompletion: true
      }
    }
  
app.StartApp(config);
console.log(`listening on http://localhost:${config.appPort}`)