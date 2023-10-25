import MindsDB from "mindsdb-js-sdk";

export async function retrieveVideoDetails(videoId: string) {
  const videoDetailsQuery = `
    SELECT * FROM mindsdb_youtube.videos
    WHERE video_id="${videoId}";
 `;

  try {
    const response = await MindsDB.SQL.runQuery(videoDetailsQuery).then(() =>
      console.log("Succesfully created a new MindsDB Youtube datastore")
    );
    return response
  } catch (error) {
    console.error("Could not connect, check connection parameters");
  }
}
