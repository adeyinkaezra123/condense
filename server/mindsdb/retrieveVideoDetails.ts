import MindsDB, { SqlQueryResult } from "mindsdb-js-sdk";

export async function retrieveVideoDetails(videoId: string) {
  const videoDetailsQuery = `
    SELECT * FROM mindsdb_youtube.video
    WHERE video_id="${videoId}";
 `;

  try {
    const response: SqlQueryResult = await MindsDB.SQL.runQuery(videoDetailsQuery);
    console.log("Succesfully retrieved video details");
    if (!response?.rows) {
      throw new Error("Invalid response from MindsDB");
    }
    return response;
  } catch (error) {
    console.error("Could not connect, check connection parameters", error);
  }
}
