export default function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      version="1.1"
      id="linksvg"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs id="defs10" />
      <path
        d="M15 7h3a5 5 0 015 5 5 5 0 01-5 5h-3m-6 0H6a5 5 0 01-5-5 5 5 0 015-5h3"
        id="path2"
      />
      <path d="M8 12h8" id="path4" />
    </svg>
  );
}
