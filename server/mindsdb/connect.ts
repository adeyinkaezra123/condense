import MindsDB from "mindsdb-js-sdk";

const mindsdb_user = process.env.MINDSDB_USERNAME;
const mindsdb_pass = process.env.MINDSDB_PASSWORD;
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const ytApiKey = process.env.YOUTUBE_DATA_API_KEY;

export async function connectMindsDB() {
  try {
    await MindsDB.connect({
      user: mindsdb_user as string,
      password: mindsdb_pass as string,
    }).then(() => console.log("Connected to MindsDB successfully"));
  } catch (error) {
    // Failed to authenticate
    console.error("Error connecting to MindsDB Cloud:", error);
  }
}

export async function connectMindsToMongo() {
  const createMindsDbInstanceQuery = `
    CREATE DATABASE ytsummaries
    WITH ENGINE = 'mongodb',
    PARAMETERS = {
        "host": "${
          "mongodb+srv://" +
          mongoUsername +
          ":" +
          mongoPassword +
          "@" +
          mongoHost
        }",
        "user": "${mongoUsername}",
        "password": "${mongoPassword}",
        "database": "ytsummaries"
    };
  `;

  try {
    await MindsDB.SQL.runQuery(createMindsDbInstanceQuery).then((data) =>
      console.log(
        "Succesfully created a MindsDB powered MongoDB instance",
        data
      )
    );
  } catch (error) {
    console.error("Could not connect, check connection parameters");
  }
}
export async function createYoutubeDatasource() {
  const createYTDatasourceQuery = `
    CREATE DATABASE mindsdb_youtube
    WITH ENGINE = 'youtube',
    PARAMETERS = {
      "youtube_api_token": "${ytApiKey}"  
    };
 `;

  try {
    await MindsDB.SQL.runQuery(createYTDatasourceQuery).then(() =>
      console.log("Succesfully created a new MindsDB Youtube datastore")
    );
  } catch (error) {
    console.error("Could not connect, check connection parameters");
  }
}
