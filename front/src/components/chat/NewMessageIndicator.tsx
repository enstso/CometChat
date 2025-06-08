type NewMessageIndicatorProps = {
  onClick: () => void;
};

function NewMessageIndicator({ onClick }: NewMessageIndicatorProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-20 right-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      aria-label="Scroll to new message"
    >
      <svg
        className="w-5 h-5 animate-bounce"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
      Nouveau message
    </button>
  );
}
export default NewMessageIndicator;