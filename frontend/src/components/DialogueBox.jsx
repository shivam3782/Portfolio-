import { useState, useEffect } from "react";

const lines = [
  "Hey, I'm Shivam Sharma.",
  "IT graduate. Full-stack developer. ML tinkerer.",
  "Currently seeking an entry-level Software Engineer or AI/ML role.",
];

function DialogueBox() {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < lines[lineIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + lines[lineIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex]);

  const handleContinue = () => {
    if (charIndex < lines[lineIndex].length) return;
    if (lineIndex < lines.length - 1) {
      setLineIndex((prev) => prev + 1);
      setDisplayedText("");
      setCharIndex(0);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center px-4">
      <div
        onClick={handleContinue}
        className="cursor-pointer max-w-2xl w-full bg-[#f4e8c1] border-4 border-[#e8935a] rounded-lg p-6 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)]"
      >
        <p className="font-pixel text-xs text-[#2d2547] mb-3">SHIVAM.EXE</p>
        <p className="text-[#1a1435] text-lg leading-relaxed min-h-[3rem]">
          {displayedText}
        </p>
        {charIndex >= lines[lineIndex].length &&
          lineIndex < lines.length - 1 && (
            <p className="absolute bottom-2 right-4 text-[#e8935a] animate-bounce font-pixel text-xs">
              ▼
            </p>
          )}
      </div>
      <p className="text-[#5fb8a8] text-xs mt-4 font-pixel">
        {lineIndex < lines.length - 1 ? "(click box to continue)" : ""}
      </p>
    </div>
  );
}

export default DialogueBox;
