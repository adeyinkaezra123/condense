import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import SummariesModel from "@/models/Summary";
import { generateTranscript, retrieveVideoId } from "@/lib/utils";
import { connectToMongoDB } from "@/mongodb/connect";
import {
  connectMindsDB,
  connectMindsToMongo,
  createYoutubeDatasource,
} from "./mindsdb/connect.js";
import { retrieveVideoDetails } from "./mindsdb/retrieveVideoDetails";

config();
const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function setupApiConnection() {
  app.get("/", (req, res) => {
    console.log(req);
    res.send("Hello world");
  });

  app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
}

// API ENDPOINTS
app.get("/summarize/video", async (req, res) => {
  const video_id = req.query.id;
  try {
    const videoExistsInDb = await SummariesModel.findOne({ video_id });
    // if (videoExistsInDb) {
    //   console.log("");
    // } else {
    //   const raw_transcript = await generateTranscript(video_id as string);
    //   const video_details = retrieveVideoDetails(video_id)
    //   res.json(raw_transcript);
    //   console.log(video_details)
    //   // const newVideo = new SummariesModel({
    //   //   videoId: video_id,
    //   //   rawTranscript: raw_transcript,
    //   //   videoTitle: "",
    //   // });
    // }
    const raw_transcript = await generateTranscript(video_id as string);
    const video_details = retrieveVideoDetails(video_id as string);
    console.log(video_details);

    res.json(video_details);
    res.status(200).send("Transcripts fetched succesfully");
  } catch (error) {
    res.status(500).send(" Whoops!, something went wrong!");
  }
});

app.get("/summarize/*", async (req, res) => {
  try {
    const query = (req.params as { [key: string]: string })[0];
    const video_id = await retrieveVideoId(query as string);
    res.status(302).redirect(`/summarize/video?id=${video_id}`);
  } catch (error) {
    res.status(404).send("Youtube video with the specified ID not found");
  }
});
(async () => {
  await Promise.all([
    setupApiConnection(),
    connectToMongoDB(),
    connectMindsDB().then(() => {
      connectMindsToMongo();
      createYoutubeDatasource();
    }),
  ]);
})();
