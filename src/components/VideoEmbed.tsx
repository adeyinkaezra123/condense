export default function VideoEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative w-full overflow-hidden">
      <iframe
        className="w-full h-full aspect-video"
        allowFullScreen
        src={`https://www.youtube.com/embed/${videoId}`}
      />
    </div>
  );
}
