import { YoutubeTranscript } from "youtube-transcript";

export interface ITranscript {
  text: string;
  duration: number;
  offset: number;
}

export interface MindsDBJsonResponse {

}

const RE_YOUTUBE =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;

export function retrieveVideoId(videoId: string) {
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

export async function retryAfter(
  retries: number,
  callback: () => void
): Promise<ReturnType<typeof callback>> {
  while (retries) {
    try {
      const results = await callback();
      return results;
    } catch (err) {
      console.error("Request failed", err);
      retries--;
      if (retries === 0) {
        throw new Error("Maximum number of retries reached");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
  }
}

export function sanitizeTranscript(
  rawTranscript: ITranscript[],
  description: string
) {
  let sanitizedTranscript = ``;
  rawTranscript.forEach((transcriptEntry) => {
    sanitizedTranscript += transcriptEntry.text + " ";
  });
  return description + sanitizedTranscript;
}

export function estimateTimeSavings(
  originalText: string,
  summarizedText: string
) {
  const readingSpeed = 200;
  const originalWords = originalText.split(/\s+/).length;
  const summarizedWords = summarizedText.split(/\s+/).length;

  const originalTime = Math.ceil(originalWords / readingSpeed);
  const summarizedTime = Math.ceil(summarizedWords / readingSpeed);
  const timeSavings = originalTime - summarizedTime;

  return timeSavings;
}
