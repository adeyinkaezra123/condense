import { YoutubeTranscript } from "youtube-transcript";

export function retrieveVideoId(videoId: string) {
  const RE_YOUTUBE =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  if (videoId.length === 11) {
    return videoId;
  }
  const matchId = videoId.match(RE_YOUTUBE);
  if (matchId && matchId.length) {
    return matchId[1];
  }
}

export const generateTranscript = async (videoUrl: string) => {
  const transcriptResponse = await YoutubeTranscript.fetchTranscript(videoUrl);

  if (!transcriptResponse) {
    throw new Error(`Cannot get transcript for ${videoUrl} video.`);
  }

  return transcriptResponse;
};
