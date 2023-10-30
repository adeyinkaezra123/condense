import { Document, VectorStoreIndex } from "llamaindex";

export async function generateSummary(
  cleanTranscript: string,
  videoTitle: string
) {
  const document = new Document({ text: cleanTranscript });
  const index = await VectorStoreIndex.fromDocuments([document]);
  // Query the index
  const queryEngine = index.asQueryEngine();
  const response = await queryEngine.query(
    `Summarize the transcript of the YouTube video titled ${videoTitle} in a concise and informative manner. The transcript should be summarized as bullets under these headers. ##Summary, ##Highlight, ##Key takeways, and finally ##Links. Provide an overview of the main points, key ideas, and any relevant statistics or examples presented in the. Your summary should properly capture the essence of the video's content. Make good use of prepositions to avoid redundant tautology. Return your response in a mdx compatible format`
  );

  return response.toString();
}
