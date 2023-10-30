import express from "express";
import cors from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";
import SummariesModel from "@/models/Summary";
import {
  ITranscript,
  generateTranscript,
  retrieveVideoId,
  retryAfter,
  sanitizeTranscript,
  estimateTimeSavings,
} from "@/lib/utils";
import { connectToMongoDB } from "@/mongodb/connect";
import {
  connectMindsDB,
  connectMindsToMongo,
  createYoutubeDatasource,
} from "./mindsdb/connect.js";
import { retrieveVideoDetails } from "./mindsdb/retrieveVideoDetails";
import { generateSummary } from "./mindsdb/generateSummary.js";

config();
const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

function setupApiConnection() {
  app.get("/", (req, res) => {
    console.log(req);
    return res.send("Hello world");
  });

  app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
}

// API ENDPOINTS
app.get("/summarize/video", async (req, res) => {
  const video_id = req.query.id;
  try {
    const videoExistsInDb = await SummariesModel.findOne({ videoId: video_id });

    if (videoExistsInDb) {
      const { transcript, videoTitle } = videoExistsInDb;
      const summary = await generateSummary(transcript, videoTitle);

      // res.status(200).send("Transcripts generated succesfully");
      return res.status(200).json({
        summary,
        time_savings: estimateTimeSavings(transcript, summary),
      });
    } else {
      const raw_transcript = await retryAfter(3, () =>
        generateTranscript(video_id as string)
      );

      const video_details = await retryAfter(3, () =>
        retrieveVideoDetails(video_id as string)
      );

      const cleanTranscript = sanitizeTranscript(
        raw_transcript as ITranscript[],
        video_details?.rows[0].description as string
      );
      const summary = await generateSummary(
        cleanTranscript,
        video_details?.rows[0].title
      );

      const newVideo = new SummariesModel({
        videoId: video_id,
        transcript: cleanTranscript,
        videoTitle: video_details?.rows[0].title,
        videoDescription: video_details?.rows[0].description,
        summary,
      });

      newVideo.save();

      // res.status(200).send("Transcripts fetched and saved succesfully");

      return res.status(200).json({
        summary,
        time_savings: estimateTimeSavings(cleanTranscript, summary),
      });
    }
  } catch (error) {
    res.status(500).send(" Whoops!, something went wrong!");
  }
});

app.get("/summarize/*", async (req, res) => {
  try {
    const query = (req.params as { [key: string]: string })[0];
    const video_id = await retrieveVideoId(query as string);
    return res.status(302).redirect(`/summarize/video?id=${video_id}`);
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

export default app