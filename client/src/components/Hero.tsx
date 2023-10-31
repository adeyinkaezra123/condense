import { ExpandingArrow, Github, Magic, LinkIcon } from "./icons/";
import { Button } from "./Button";
import { Form } from "./Form";
import { useState, useEffect, useRef } from "react";
import VideoEmbed from "./VideoEmbed";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

const Hero = () => {
  const [videoId, setVideoId] = useState("");
  const [videoSummary, setVideoSummary] = useState({
    url: "",
    summary: "",
  });

  const summaryContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoSummary.summary) {
      summaryContainer.current?.scrollIntoView();
    }
  }, [videoSummary]);

  const API_URL = import.meta.env.VITE_API_URL;
  async function generateSummary(videoParams: { youtubeUrl: string }) {
    const { youtubeUrl } = videoParams;
    const loadingToast = toast.loading("Retrieving video details");
    try {
      const videoId = retrieveVideoId(youtubeUrl);

      const { data } = await axios.get(API_URL + videoId);

      setVideoSummary(data);
      setVideoId(videoId!);
      toast.dismiss(loadingToast);
      toast.success("Summary generated!");
      console.log(data);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Youtube video not found", error);
      toast.error("Could not generate summary for this video");
    }
  }

  return (
    <section>
      <Toaster />
      <header className="w-full flex justify-center items-center flex-col">
        <nav className="flex justify-between items-center w-full mb-10 pt-3">
          <div className="flex justify-between items-center gap-4">
            <Magic className="w-10 h-10" />
            <span className="font-bold text-lg">condense</span>
          </div>
          <Button
            className="flex gap-4 rounded-[999px] border max-w-[15%]"
            icon={<Github />}
            onClick={() => window.open("https://github.com/adeyinkaezra123")}
            text="GitHub"
          />
        </nav>
        <a
          className="group mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.1)] backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50"
          href="/blog/rebrand"
        >
          <p className="text-sm font-semibold text-gray-700">
            Read the article here
          </p>
          <ExpandingArrow />
        </a>
        <h1 className="head_text">
          <span className="orange_gradient">Supercharge </span>
          Your YouTube Experience with
          <br className="max-md:hidden" />
          <span className="green_gradient">MindsDB</span>
        </h1>
        <h2 className="desc">
          Condense stands as an open-source YouTube video summarizer, driven by
          AI, enhancing your video-watching efficiency, by getting to the heart
          of every video in seconds
        </h2>
        <div className="mt-10 w-full">
          <Form
            icon={<LinkIcon />}
            handleSubmit={generateSummary as never}
            buttonText="Summarize"
            inputData={{
              name: "youtubeUrl",
              defaultValue: "",
              placeholder: "Paste any Youtube video link to get started",
              autoComplete: "off",
              maxLength: 140,
            }}
            helpText="Tip, navigate to the video and copy the link from the address bar"
          />
        </div>
        {videoSummary.summary && (
          <div ref={summaryContainer} className="mt-10 summary_box">
            <VideoEmbed videoId={videoId} />
            <ReactMarkdown className="p-12 summary" remarkPlugins={[remarkGfm]}>
              {`${videoSummary.summary}` ?? "Unavailable"}
            </ReactMarkdown>
          </div>
        )}
      </header>
    </section>
  );
};

export default Hero;
